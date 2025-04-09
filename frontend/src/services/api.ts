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
      // Call the validation API
      const response = await api.post('/auth/validate-email', { email });
      
      // Store the email in session storage
      sessionStorage.setItem('email', email);
      
      // Store the selected university name and marketplace URL for redirection
      if (response.data.universityName) {
        sessionStorage.setItem('universityName', response.data.universityName);
      }
      if (response.data.marketplaceUrl) {
        sessionStorage.setItem('marketplaceUrl', response.data.marketplaceUrl);
      }

      // Extract domain from email to check if it's directly supported
      const domain = email.split('@')[1];
      
      // A school is directly supported if the email domain matches one of our supported universities
      // For now, we only have northeastern.edu as directly supported
      const isDirectlySupported = domain === 'northeastern.edu';
      
      // Store whether the school is directly supported
      sessionStorage.setItem('isDirectlySupported', String(isDirectlySupported));
      
      // The backend returns a SchoolRedirectDTO with universityName, marketplaceUrl, and marketplaceName
      return {
        universityName: response.data.universityName || '',
        isSupported: true,
        message: "Verification code sent to your email address."
      };
    } catch (error: any) {
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
      // Call the backend API to verify the code
      const response = await api.post('/auth/verify-code', { email, code });
      
      // If remember me is checked, store a token that expires in 30 days
      if (rememberMe) {
        const expiryDate = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
        localStorage.setItem('email', email);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('tokenExpiry', expiryDate.toString());
      }
      
      // Return the response data
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  
  resendCode: async (email: string): Promise<EmailValidationResponse> => {
    try {
      const response = await api.post('/auth/validate-email', { email });
      
      return {
        universityName: response.data.universityName || '',
        isSupported: true,
        message: "Verification code resent to your email address."
      };
    } catch (error: any) {
      throw error;
    }
  },
  
  setupProfile: async (profileData: ProfileSetupRequest, email: string): Promise<ProfileSetupResponse> => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('firstName', profileData.firstName);
    formData.append('lastName', profileData.lastName);
    formData.append('phoneNumber', profileData.phoneNumber);
    
    if (profileData.description) {
      formData.append('description', profileData.description);
    }
    
    if (profileData.profilePicture && profileData.profilePicture instanceof File) {
      formData.append('profilePicture', profileData.profilePicture);
    }
    
    try {
      const response = await fetch(`${API_URL}/auth/profile-setup`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header as it will be set automatically with correct boundary for multipart/form-data
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to set up profile (${response.status})`);
      }
      
      const data = await response.json();
      console.log('Profile setup successful:', data);
      return data;
    } catch (error: any) {
      console.error("Error setting up profile:", error);
      
      // If we can't connect to the backend, create a fallback with a data URL
      if (profileData.profilePicture && profileData.profilePicture instanceof File) {
        try {
          const dataUrl = await convertFileToDataURL(profileData.profilePicture);
          const domain = email.split('@')[1] || '';
          const universityNamePart = domain.split('.')[0] || '';
          const universityName = universityNamePart.charAt(0).toUpperCase() + universityNamePart.slice(1);
          
          const response: ProfileSetupResponse = {
            id: 1,
            email: email,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            phoneNumber: profileData.phoneNumber,
            description: profileData.description || null,
            profilePictureUrl: dataUrl,
            universityName: universityName,
            token: localStorage.getItem('token') || "token-" + Math.random().toString(36).substring(2)
          };
          return response;
        } catch (fileError) {
          console.error("Error converting file to data URL:", fileError);
        }
      }
      
      throw error;
    }
  },
  
  getUserProfile: async (email: string): Promise<ProfileSetupResponse | null> => {
    try {
      const response = await api.get(`/auth/profile/${email}`);
      return response.data;
    } catch (error: any) {
      console.error("Error getting user profile:", error);
      
      // Temporary fallback to load profile from session storage
      console.warn("Using temporary profile from session storage");
      const firstName = sessionStorage.getItem('firstName');
      const lastName = sessionStorage.getItem('lastName');
      const profilePictureUrl = sessionStorage.getItem('profilePictureUrl');
      const universityName = sessionStorage.getItem('universityName');
      
      // If we have any profile data in session storage, return it
      if (firstName && lastName) {
        return {
          email: email,
          firstName: firstName,
          lastName: lastName,
          phoneNumber: sessionStorage.getItem('phoneNumber') || '',
          description: sessionStorage.getItem('description') || null,
          profilePictureUrl: profilePictureUrl || null,
          universityName: universityName || '',
          token: sessionStorage.getItem('token') || ''
        } as ProfileSetupResponse;
      }
      
      // Return null if no profile data is found
      return null;
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

// Helper function to convert a File to a data URL
const convertFileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to data URL'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    reader.readAsDataURL(file);
  });
};

export default api; 