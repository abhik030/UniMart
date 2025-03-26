// Environment variables for frontend
// In production, these would be loaded from environment variables

// Get API URL from environment variable or use default
const getApiUrl = () => {
  // For development, use the backend running locally
  return process.env.REACT_APP_API_URL || 'http://localhost:8081/api';
};

export const env = {
  // API configuration
  API_URL: getApiUrl(),
  DEBUG: true, // Enable debug mode
  
  // Email configuration (these would be set by the backend in a real application)
  MAIL_HOST: 'smtp.gmail.com',
  MAIL_PORT: 587,
  MAIL_USERNAME: 'studentunimart@gmail.com',
  MAIL_PASSWORD: '********', // Password would be securely stored on the backend
};

export default env; 