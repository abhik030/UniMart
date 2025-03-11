# UniMart Frontend

This is the frontend application for UniMart, a university marketplace platform.

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