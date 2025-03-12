# UniMart Frontend

This is the frontend application for UniMart, a university marketplace platform.

## Email Verification Implementation

The current implementation uses a mock email verification system for development purposes. In a production environment, email sending should be handled by the backend for security reasons.

### Current Implementation (Development)

- The frontend simulates sending verification emails
- Verification codes are generated and stored in memory
- No actual emails are sent

### Recommended Production Implementation

For a production environment, the following architecture is recommended:

1. **Backend Email Service**:
   - Create an API endpoint for email verification (e.g., `/api/auth/send-verification`)
   - Implement nodemailer or another email service on the backend
   - Store email credentials securely in environment variables on the server

2. **Frontend Implementation**:
   - Make API calls to the backend to request email verification
   - Handle success/error responses from the backend
   - Display appropriate UI feedback to the user

3. **Security Considerations**:
   - Never store email credentials in frontend code
   - Use HTTPS for all API communications
   - Implement rate limiting to prevent abuse
   - Set appropriate expiration times for verification codes

## Getting Started

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm start
```

### Building for Production

```bash
npm run build
```

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App
- `npm run webpack`: Runs webpack with the custom configuration

## Dependencies

- React
- React Router
- Styled Components
- Framer Motion
- Axios

## Development Notes

- The application uses a proxy to communicate with the backend API
- Mock services are used for development when the backend is not available
- Environment variables are loaded from the `.env` file in the config directory

## Project Structure

- `src/components`: Reusable UI components
- `src/pages`: Page components for different routes
- `src/services`: API services and utilities
- `src/assets`: Static assets like images and icons

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (which includes npm)

## Installation

1. Install Node.js from [https://nodejs.org/](https://nodejs.org/)
2. Clone this repository
3. Navigate to the frontend directory:
   ```
   cd frontend
   ```
4. Install dependencies:
   ```
   npm install
   ```

## Running the Application

To start the development server:
```
npm start
```

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Building for Production

To build the app for production:
```
npm run build
```

This builds the app for production to the `build` folder.

## Project Structure

- `src/components`: Reusable UI components
- `src/pages`: Page components for different routes
- `src/services`: API services and utilities
- `src/assets`: Static assets like images and icons

## Dependencies

- React
- React Router
- Styled Components
- Framer Motion
- Axios for API requests 