import axios from 'axios';
import { EmailRequest, VerifyRequest, SchoolRedirectDTO, UserResponseDTO, SupportedUniversityDTO } from '../types';

// Using relative URL since we have a proxy set in package.json
const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// For development/testing when backend is not available
const mockValidateEmail = (email: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email.endsWith('.edu')) {
        resolve({
          universityName: email.split('@')[1].split('.')[0].charAt(0).toUpperCase() + 
                         email.split('@')[1].split('.')[0].slice(1),
          isSupported: true,
          message: "Email validated successfully"
        });
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
const mockVerifyCode = (email: string, code: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (code === '123456' || code === '') {
        resolve({
          id: 1,
          email: email,
          username: email.split('@')[0],
          universityName: email.split('@')[1].split('.')[0].charAt(0).toUpperCase() + 
                         email.split('@')[1].split('.')[0].slice(1),
          token: "mock-token-" + Math.random().toString(36).substring(2)
        });
      } else {
        reject({
          response: {
            status: 400,
            data: "Invalid verification code"
          }
        });
      }
    }, 1000);
  });
};

export const authService = {
  validateEmail: async (email: string) => {
    try {
      // For development/testing when backend is not available
      // return await mockValidateEmail(email);
      
      const response = await api.post('/auth/validate-email', { email });
      return response.data;
    } catch (error: any) {
      // For development/testing when backend is not available
      if (!error.response) {
        return await mockValidateEmail(email);
      }
      throw error;
    }
  },
  
  verifyCode: async (email: string, code: string) => {
    try {
      // For development/testing when backend is not available
      // return await mockVerifyCode(email, code);
      
      const response = await api.post('/auth/verify-code', { email, code });
      return response.data;
    } catch (error: any) {
      // For development/testing when backend is not available
      if (!error.response) {
        return await mockVerifyCode(email, code);
      }
      throw error;
    }
  },
  
  resendCode: async (email: string) => {
    try {
      const response = await api.post('/auth/resend-code', { email });
      return response.data;
    } catch (error: any) {
      // For development/testing when backend is not available
      if (!error.response) {
        return await mockValidateEmail(email);
      }
      throw error;
    }
  },
  
  getSupportedUniversities: async () => {
    try {
      const response = await api.get('/auth/supported-universities');
      return response.data;
    } catch (error: any) {
      // For development/testing when backend is not available
      if (!error.response) {
        return [
          { id: 1, name: "Northeastern University", domain: "northeastern.edu", logoUrl: null },
          { id: 2, name: "Harvard University", domain: "harvard.edu", logoUrl: null },
          { id: 3, name: "MIT", domain: "mit.edu", logoUrl: null },
          { id: 4, name: "Stanford University", domain: "stanford.edu", logoUrl: null }
        ];
      }
      throw error;
    }
  }
};

export default api; 