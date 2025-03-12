# Backend Email Verification Implementation Plan

This document outlines the plan for implementing real email verification on the backend.

## Architecture

1. **API Endpoints**:
   - `POST /api/auth/send-verification`: Sends a verification email
   - `POST /api/auth/verify-code`: Verifies the code entered by the user
   - `POST /api/auth/resend-code`: Resends a verification email

2. **Database Schema**:
   ```sql
   CREATE TABLE verification_codes (
     id INT AUTO_INCREMENT PRIMARY KEY,
     email VARCHAR(255) NOT NULL,
     code VARCHAR(6) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     expires_at TIMESTAMP NOT NULL,
     attempts INT DEFAULT 0,
     verified BOOLEAN DEFAULT FALSE,
     INDEX (email)
   );
   ```

3. **Email Service**:
   ```javascript
   // backend/services/emailService.js
   const nodemailer = require('nodemailer');
   require('dotenv').config();

   const transporter = nodemailer.createTransport({
     host: process.env.MAIL_HOST,
     port: process.env.MAIL_PORT,
     secure: process.env.MAIL_PORT === '465',
     auth: {
       user: process.env.MAIL_USERNAME,
       pass: process.env.MAIL_PASSWORD,
     },
   });

   const sendVerificationEmail = async (to, code) => {
     const mailOptions = {
       from: `"UniMart" <${process.env.MAIL_USERNAME}>`,
       to,
       subject: 'UniMart Email Verification',
       html: `
         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
           <h2 style="color: #4F46E5; text-align: center;">UniMart Email Verification</h2>
           <p>Thank you for registering with UniMart! Please use the following code to verify your email address:</p>
           <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
             ${code}
           </div>
           <p>This code will expire in 10 minutes.</p>
           <p>If you did not request this verification, please ignore this email.</p>
           <div style="text-align: center; margin-top: 20px; color: #666;">
             <p>© ${new Date().getFullYear()} UniMart. All rights reserved.</p>
           </div>
         </div>
       `,
     };

     try {
       const info = await transporter.sendMail(mailOptions);
       console.log('Message sent: %s', info.messageId);
       return true;
     } catch (error) {
       console.error('Error sending email:', error);
       return false;
     }
   };

   module.exports = {
     sendVerificationEmail,
   };
   ```

4. **Controller Implementation**:
   ```javascript
   // backend/controllers/authController.js
   const { sendVerificationEmail } = require('../services/emailService');
   const db = require('../database');

   // Generate a random 6-digit code
   const generateVerificationCode = () => {
     return Math.floor(100000 + Math.random() * 900000).toString();
   };

   // Send verification email
   const sendVerification = async (req, res) => {
     const { email } = req.body;

     if (!email) {
       return res.status(400).json({ error: 'Email is required' });
     }

     // Check if email is a .edu email
     if (!email.endsWith('.edu')) {
       return res.status(400).json({ 
         error: 'Email domain not supported. Please use a .edu email.' 
       });
     }

     try {
       // Generate a verification code
       const code = generateVerificationCode();
       
       // Set expiration time (10 minutes from now)
       const expiresAt = new Date();
       expiresAt.setMinutes(expiresAt.getMinutes() + 10);
       
       // Store the code in the database
       await db.query(
         `INSERT INTO verification_codes (email, code, expires_at) 
          VALUES (?, ?, ?) 
          ON DUPLICATE KEY UPDATE 
          code = VALUES(code), 
          expires_at = VALUES(expires_at), 
          attempts = 0, 
          verified = FALSE`,
         [email, code, expiresAt]
       );
       
       // Send the email
       const emailSent = await sendVerificationEmail(email, code);
       
       if (emailSent) {
         // Extract university name from email domain
         const domain = email.split('@')[1];
         const universityName = domain.split('.')[0].charAt(0).toUpperCase() + 
                               domain.split('.')[0].slice(1);
         
         return res.status(200).json({
           universityName,
           isSupported: true,
           message: 'Verification code sent to your email address.'
         });
       } else {
         return res.status(500).json({ 
           error: 'Failed to send verification email. Please try again.' 
         });
       }
     } catch (error) {
       console.error('Error sending verification:', error);
       return res.status(500).json({ 
         error: 'An error occurred. Please try again.' 
       });
     }
   };

   // Verify code
   const verifyCode = async (req, res) => {
     const { email, code, rememberMe } = req.body;

     if (!email || !code) {
       return res.status(400).json({ error: 'Email and code are required' });
     }

     try {
       // Get the verification record
       const [records] = await db.query(
         'SELECT * FROM verification_codes WHERE email = ? LIMIT 1',
         [email]
       );
       
       if (records.length === 0) {
         return res.status(400).json({ 
           error: 'No verification code found for this email. Please request a new code.' 
         });
       }
       
       const record = records[0];
       
       // Check if code is expired
       const now = new Date();
       if (now > new Date(record.expires_at)) {
         return res.status(400).json({ 
           error: 'Verification code has expired. Please request a new code.' 
         });
       }
       
       // Increment attempts
       await db.query(
         'UPDATE verification_codes SET attempts = attempts + 1 WHERE id = ?',
         [record.id]
       );
       
       // Check if too many attempts
       if (record.attempts >= 5) {
         return res.status(400).json({ 
           error: 'Too many failed attempts. Please request a new code.' 
         });
       }
       
       // Check if code matches
       if (code !== record.code) {
         return res.status(400).json({ 
           error: `Invalid verification code. ${5 - record.attempts} attempts remaining.` 
         });
       }
       
       // Mark as verified
       await db.query(
         'UPDATE verification_codes SET verified = TRUE WHERE id = ?',
         [record.id]
       );
       
       // Extract username and university name from email
       const username = email.split('@')[0];
       const domain = email.split('@')[1];
       const universityName = domain.split('.')[0].charAt(0).toUpperCase() + 
                             domain.split('.')[0].slice(1);
       
       // Check if this is the first login
       const [userRecords] = await db.query(
         'SELECT * FROM users WHERE email = ? LIMIT 1',
         [email]
       );
       
       const isFirstLogin = userRecords.length === 0;
       
       // Generate token
       const token = generateToken(email);
       
       // If remember me is checked, store a token that expires in 30 days
       if (rememberMe) {
         // Store remember me token in database
         // ...
       }
       
       return res.status(200).json({
         id: userRecords.length > 0 ? userRecords[0].id : null,
         email,
         username,
         universityName,
         token,
         isFirstLogin
       });
     } catch (error) {
       console.error('Error verifying code:', error);
       return res.status(500).json({ 
         error: 'An error occurred. Please try again.' 
       });
     }
   };

   // Resend verification code
   const resendCode = async (req, res) => {
     const { email } = req.body;

     if (!email) {
       return res.status(400).json({ error: 'Email is required' });
     }

     try {
       // Generate a new verification code
       const code = generateVerificationCode();
       
       // Set expiration time (10 minutes from now)
       const expiresAt = new Date();
       expiresAt.setMinutes(expiresAt.getMinutes() + 10);
       
       // Update the code in the database
       await db.query(
         `INSERT INTO verification_codes (email, code, expires_at) 
          VALUES (?, ?, ?) 
          ON DUPLICATE KEY UPDATE 
          code = VALUES(code), 
          expires_at = VALUES(expires_at), 
          attempts = 0, 
          verified = FALSE`,
         [email, code, expiresAt]
       );
       
       // Send the email
       const emailSent = await sendVerificationEmail(email, code);
       
       if (emailSent) {
         // Extract university name from email domain
         const domain = email.split('@')[1];
         const universityName = domain.split('.')[0].charAt(0).toUpperCase() + 
                               domain.split('.')[0].slice(1);
         
         return res.status(200).json({
           universityName,
           isSupported: true,
           message: 'Verification code sent to your email address.'
         });
       } else {
         return res.status(500).json({ 
           error: 'Failed to send verification email. Please try again.' 
         });
       }
     } catch (error) {
       console.error('Error resending code:', error);
       return res.status(500).json({ 
         error: 'An error occurred. Please try again.' 
       });
     }
   };

   module.exports = {
     sendVerification,
     verifyCode,
     resendCode,
   };
   ```

5. **Routes**:
   ```javascript
   // backend/routes/authRoutes.js
   const express = require('express');
   const router = express.Router();
   const authController = require('../controllers/authController');

   router.post('/send-verification', authController.sendVerification);
   router.post('/verify-code', authController.verifyCode);
   router.post('/resend-code', authController.resendCode);

   module.exports = router;
   ```

6. **Server Setup**:
   ```javascript
   // backend/server.js
   const express = require('express');
   const cors = require('cors');
   const authRoutes = require('./routes/authRoutes');

   const app = express();
   const PORT = process.env.PORT || 3001;

   app.use(cors());
   app.use(express.json());

   app.use('/api/auth', authRoutes);

   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

## Implementation Steps

1. Set up the backend project structure
2. Install required dependencies:
   ```bash
   npm init -y
   npm install express cors mysql2 nodemailer dotenv jsonwebtoken
   npm install --save-dev nodemon
   ```
3. Create the database schema
4. Implement the email service
5. Implement the controllers and routes
6. Test the API endpoints
7. Update the frontend to use the real API endpoints

## Security Considerations

1. **Rate Limiting**: Implement rate limiting to prevent abuse
2. **Input Validation**: Validate all user inputs
3. **Secure Storage**: Store email credentials securely in environment variables
4. **HTTPS**: Use HTTPS for all API communications
5. **Token Security**: Implement secure token generation and validation
6. **Error Handling**: Implement proper error handling and logging
7. **Code Expiry**: Ensure verification codes expire after a reasonable time

## Testing

1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test the API endpoints
3. **End-to-End Tests**: Test the complete flow from frontend to backend
4. **Security Tests**: Test for common security vulnerabilities

## Deployment

1. **Environment Variables**: Set up environment variables for production
2. **Database Setup**: Set up the production database
3. **Server Configuration**: Configure the production server
4. **Monitoring**: Set up monitoring and logging
5. **Backup**: Set up database backups 