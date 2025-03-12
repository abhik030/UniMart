import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { 
  EmailRequest, 
  VerifyRequest, 
  SchoolRedirectDTO, 
  UserResponseDTO, 
  SupportedUniversityDTO,
  EmailValidationResponse,
  ProfileSetupRequest,
  ProfileSetupResponse
} from '../types/index';
import { emailService } from './emailService';
import { env } from './env';

// Using API URL from environment variables
const API_URL = env.API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store verification codes for emails
const emailVerificationCodes: Record<string, { code: string, timestamp: number, attempts: number }> = {};

// Store verified emails to simulate first-time login
const verifiedEmails = new Set<string>();

// Store remember me tokens
const rememberMeTokens: Record<string, { token: string, expiry: number }> = {};

// Generate a random 6-digit code
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Mock email validation function
export const mockValidateEmail = async (email: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      if (email.endsWith('.edu')) {
        // Extract university name from email domain
        const domain = email.split('@')[1];
        const universityName = domain.split('.')[0].charAt(0).toUpperCase() + 
                              domain.split('.')[0].slice(1);
        
        // Generate a real verification code
        const verificationCode = generateVerificationCode();
        
        // Store the code with timestamp and reset attempts
        emailVerificationCodes[email] = {
          code: verificationCode,
          timestamp: Date.now(),
          attempts: 0
        };
        
        // Log the verification code prominently
        console.log('');
        console.log('==============================================');
        console.log(`🔑 VERIFICATION CODE FOR ${email}: ${verificationCode}`);
        console.log('==============================================');
        console.log('');
        
        // Send a real email with the verification code
        try {
          const emailSent = await emailService.sendVerificationEmail(email, verificationCode);
          
          if (emailSent) {
            console.log(`Verification email sent to ${email} with code: ${verificationCode}`);
            resolve(verificationCode);
          } else {
            console.error(`Failed to send verification email to ${email}`);
            reject({
              response: {
                status: 500,
                data: "Failed to send verification email. Please try again."
              }
            });
          }
        } catch (error) {
          console.error("Error sending verification email:", error);
          reject({
            response: {
              status: 500,
              data: "Failed to send verification email. Please try again."
            }
          });
        }
      } else {
        reject({
          response: {
            status: 400,
            data: "Email domain not supported. Please use a .edu email."
          }
        });
      }
    }, 1000);
  });
};

// For development/testing when backend is not available
const mockVerifyCode = (email: string, code: string, rememberMe: boolean = false): Promise<UserResponseDTO> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if we have a verification code for this email
      const storedVerification = emailVerificationCodes[email];
      
      if (!storedVerification) {
        reject({
          response: {
            status: 400,
            data: "No verification code found for this email. Please request a new code."
          }
        });
        return;
      }
      
      // Check if code is expired (15 minutes)
      const codeAge = Date.now() - storedVerification.timestamp;
      const codeExpired = codeAge > 15 * 60 * 1000; // 15 minutes
      
      if (codeExpired) {
        delete emailVerificationCodes[email];
        reject({
          response: {
            status: 400,
            data: "Verification code has expired. Please request a new code."
          }
        });
        return;
      }
      
      // Increment attempts
      storedVerification.attempts += 1;
      
      // Check if too many attempts (max 5)
      if (storedVerification.attempts > 5) {
        delete emailVerificationCodes[email];
        reject({
          response: {
            status: 400,
            data: "Too many failed attempts. Please request a new code."
          }
        });
        return;
      }
      
      // Check if code matches
      if (code === storedVerification.code) {
        // Extract username from email
        const username = email.split('@')[0];
        // Extract university name from email domain
        const domain = email.split('@')[1];
        const universityName = domain.split('.')[0].charAt(0).toUpperCase() + 
                              domain.split('.')[0].slice(1);
        
        // Check if this is the first login for this email
        const isFirstLogin = !verifiedEmails.has(email);
        
        // Add email to verified set
        verifiedEmails.add(email);
        
        // Generate token
        const token = "mock-token-" + Math.random().toString(36).substring(2);
        
        // If remember me is checked, store a token that expires in 30 days
        if (rememberMe) {
          const expiryDate = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
          rememberMeTokens[email] = {
            token: token,
            expiry: expiryDate
          };
          console.log(`Remember me token set for ${email}, expires in 30 days`);
        }
        
        // Clean up verification code
        delete emailVerificationCodes[email];
        
        resolve({
          id: 1,
          email: email,
          username: username,
          universityName: universityName,
          token: token,
          isFirstLogin: isFirstLogin
        });
      } else {
        reject({
          response: {
            status: 400,
            data: `Invalid verification code. ${5 - storedVerification.attempts} attempts remaining.`
          }
        });
      }
    }, 1000);
  });
};

// For development/testing when backend is not available
const mockSetupProfile = (profileData: ProfileSetupRequest, email: string): Promise<ProfileSetupResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Extract university name from email domain
      const domain = email.split('@')[1];
      const universityName = domain.split('.')[0].charAt(0).toUpperCase() + 
                            domain.split('.')[0].slice(1);
      
      // Mock profile picture URL
      let profilePictureUrl = null;
      if (profileData.profilePicture) {
        profilePictureUrl = URL.createObjectURL(profileData.profilePicture);
      }
      
      resolve({
        id: 1,
        email: email,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phoneNumber: profileData.phoneNumber,
        description: profileData.description || null,
        profilePictureUrl: profilePictureUrl,
        universityName: universityName,
        token: "mock-token-" + Math.random().toString(36).substring(2)
      });
    }, 1000);
  });
};

export const authService = {
  validateEmail: async (email: string): Promise<EmailValidationResponse> => {
    try {
      const response = await api.post('/auth/validate-email', { email });
      console.log('Backend response:', response.data);
      
      // Store the email in session storage
      sessionStorage.setItem('email', email);
      
      return {
        universityName: response.data.universityName || '',
        isSupported: true,
        message: "Verification code sent to your email address."
      };
    } catch (error: any) {
      console.error("Error validating email:", error);
      
      // If the error is a 400 (Bad Request), it might be because the school is not supported
      if (error.response && error.response.status === 400) {
        // Store the email in session storage anyway for the unsupported school page
        sessionStorage.setItem('email', email);
      }
      
      throw error;
    }
  },
  
  verifyCode: async (email: string, code: string, rememberMe: boolean = false): Promise<UserResponseDTO> => {
    try {
      const response = await api.post('/auth/verify-code', { email, code });
      console.log('Verification response:', response.data);
      
      // If remember me is checked, store a token that expires in 30 days
      if (rememberMe) {
        const expiryDate = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
        localStorage.setItem('email', email);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('tokenExpiry', expiryDate.toString());
        console.log(`Remember me token set for ${email}, expires in 30 days`);
      }
      
      // Always treat as a first-time login since we're not storing user data
      const responseData = {
        ...response.data,
        isFirstLogin: true
      };
      
      return responseData;
    } catch (error: any) {
      console.error("Error verifying code:", error);
      throw error;
    }
  },
  
  resendCode: async (email: string): Promise<EmailValidationResponse> => {
    try {
      const response = await api.post('/auth/validate-email', { email });
      console.log('Resend code response:', response.data);
      
      return {
        universityName: response.data.universityName || '',
        isSupported: true,
        message: "Verification code resent to your email address."
      };
    } catch (error: any) {
      console.error("Error resending code:", error);
      throw error;
    }
  },
  
  checkRememberMeToken: (email: string): boolean => {
    const storedToken = rememberMeTokens[email];
    if (storedToken && storedToken.expiry > Date.now()) {
      return true;
    }
    return false;
  },
  
  setupProfile: async (profileData: ProfileSetupRequest, email: string): Promise<ProfileSetupResponse> => {
    try {
      // Always use mock for development until backend is ready
      return await mockSetupProfile(profileData, email);
      
      // When backend is ready, uncomment this:
      /*
      const formData = new FormData();
      formData.append('email', email);
      formData.append('firstName', profileData.firstName);
      formData.append('lastName', profileData.lastName);
      formData.append('phoneNumber', profileData.phoneNumber);
      
      if (profileData.description) {
        formData.append('description', profileData.description);
      }
      
      if (profileData.profilePicture) {
        formData.append('profilePicture', profileData.profilePicture);
      }
      
      const response = await fetch(`${API_URL}/auth/profile-setup`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to set up profile');
      }
      
      return response.json();
      */
    } catch (error: any) {
      console.error("Error setting up profile:", error);
      throw error;
    }
  },
  
  getSupportedUniversities: async (): Promise<SupportedUniversityDTO[]> => {
    try {
      // Always use mock for development until backend is ready
      return [
        { id: 1, name: "Northeastern University", domain: "northeastern.edu", logoUrl: null },
        { id: 2, name: "Harvard University", domain: "harvard.edu", logoUrl: null },
        { id: 3, name: "MIT", domain: "mit.edu", logoUrl: null },
        { id: 4, name: "Stanford University", domain: "stanford.edu", logoUrl: null }
      ];
      
      // When backend is ready, uncomment this:
      // const response = await api.get('/auth/supported-universities');
      // return response.data;
    } catch (error: any) {
      console.error("Error getting supported universities:", error);
      throw error;
    }
  }
};

export default api; 