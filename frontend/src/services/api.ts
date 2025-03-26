import axios from 'axios';
import { 
  SchoolRedirectDTO, 
  UserResponseDTO, 
  SupportedUniversityDTO,
  EmailValidationResponse,
  ProfileSetupRequest,
  ProfileSetupResponse
} from '../types/index';
import { env } from './env';

// Using API URL from environment variables
const API_URL = env.API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  validateEmail: async (email: string): Promise<EmailValidationResponse> => {
    try {
      console.log('Calling validateEmail API with email:', email);
      console.log('API URL being used:', API_URL);
      console.log('Full API endpoint:', `${API_URL}/auth/validate-email`);
      
      const response = await api.post('/auth/validate-email', { email });
      console.log('Backend validateEmail response status:', response.status);
      console.log('Backend validateEmail response data:', response.data);
      
      // Store the email in session storage
      sessionStorage.setItem('email', email);
      
      return {
        universityName: response.data.universityName || '',
        isSupported: true,
        message: "Verification code sent to your email address."
      };
    } catch (error: any) {
      console.error("Error validating email:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
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
  
  setupProfile: async (profileData: ProfileSetupRequest, email: string): Promise<ProfileSetupResponse> => {
    try {
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
    } catch (error: any) {
      console.error("Error setting up profile:", error);
      
      // Temporary fallback until backend endpoint is ready
      console.warn("Using temporary mock profile setup until backend is ready");
      return mockSetupProfileFallback(profileData, email);
    }
  },
  
  getSupportedUniversities: async (): Promise<SupportedUniversityDTO[]> => {
    try {
      const response = await api.get('/auth/supported-universities');
      return response.data;
    } catch (error: any) {
      console.error("Error getting supported universities:", error);
      throw error;
    }
  },
  
  checkRememberMeToken: (email: string): boolean => {
    try {
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      if (!tokenExpiry) return false;
      
      const expiryTime = parseInt(tokenExpiry, 10);
      const currentTime = Date.now();
      
      // Check if the token has expired
      if (currentTime > expiryTime) {
        console.log('Remember me token has expired');
        return false;
      }
      
      // Check if the stored email matches the provided email
      const storedEmail = localStorage.getItem('email');
      if (storedEmail !== email) {
        console.log('Email mismatch in remember me token');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking remember me token:', error);
      return false;
    }
  }
};

// Temporary fallback function until backend endpoint is ready
// This will be removed once the backend profile setup endpoint is implemented
const mockSetupProfileFallback = (profileData: ProfileSetupRequest, email: string): Promise<ProfileSetupResponse> => {
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

export default api; 