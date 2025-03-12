// Mock email service for frontend
// In a real application, email sending would be handled by the backend

// Function to simulate sending verification email
export const sendVerificationEmail = async (to: string, code: string): Promise<boolean> => {
  try {
    // Log the verification code prominently for testing
    console.log('');
    console.log('==============================================');
    console.log(`🔑 VERIFICATION CODE FOR ${to}: ${code}`);
    console.log('==============================================');
    console.log('');
    
    // In a real application, this would make an API call to the backend
    // For now, we'll simulate a successful email send
    
    // Create a mock email content for display in console
    const emailContent = `
    --------------------------------
    From: UniMart <studentunimart@gmail.com>
    To: ${to}
    Subject: Your UniMart Verification Code
    
    Your verification code is: ${code}
    
    This code will expire in 15 minutes.
    
    If you didn't request this code, you can safely ignore this email.
    
    © ${new Date().getFullYear()} UniMart. All rights reserved.
    --------------------------------
    `;
    
    console.log('Mock Email Content:');
    console.log(emailContent);
    
    return true;
  } catch (error) {
    console.error('Error in email service:', error);
    return false;
  }
};

export const emailService = {
  sendVerificationEmail,
}; 