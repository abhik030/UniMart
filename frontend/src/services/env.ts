// Environment variables for frontend
// In production, these would be loaded from environment variables

export const env = {
  // API configuration
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8081/api',
  
  // Email configuration (these would be set by the backend in a real application)
  MAIL_HOST: 'smtp.gmail.com',
  MAIL_PORT: 587,
  MAIL_USERNAME: 'studentunimart@gmail.com',
  MAIL_PASSWORD: '********', // Password would be securely stored on the backend
};

export default env; 