# UniMart Frontend Setup Instructions

## Prerequisites

Before you can run the UniMart frontend, you need to have Node.js installed on your system. We've provided two ways to install Node.js:

### Option 1: Using the Installer Script (Recommended)

1. Run the `install-nodejs.bat` file in the frontend directory by double-clicking it or running it from PowerShell:
   ```
   .\install-nodejs.bat
   ```

2. Follow the installation wizard if prompted.

3. After installation completes, **restart your PowerShell or command prompt**.

### Option 2: Manual Installation

1. Visit [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
2. Download the Windows Installer (.msi) for your system (64-bit recommended)
3. Run the installer and follow the installation wizard
4. Restart your PowerShell or command prompt

## Verifying the Installation

After installing Node.js and restarting your terminal, verify the installation by running:
```
node -v
npm -v
```

Both commands should display version numbers, confirming successful installation.

## Running the Application

Once Node.js is installed, follow these steps to run the application:

1. Open PowerShell or Command Prompt
2. Navigate to the frontend directory:
   ```
   cd C:\Users\abhis\UniMart\frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```
5. The application should open automatically in your default browser at [http://localhost:3000](http://localhost:3000)

## Troubleshooting

### PowerShell Execution Policy

If you encounter errors related to running scripts in PowerShell, you may need to change the execution policy:

1. Open PowerShell as Administrator
2. Run the following command:
   ```
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Type 'Y' to confirm

### npm Command Not Found

If you've installed Node.js but the `npm` command is not recognized:

1. Make sure you've restarted your terminal after installation
2. Check if Node.js is in your PATH by running `where node`
3. If needed, add the Node.js installation directory to your PATH environment variable

## Next Steps

After successfully running the application, you can:

1. Test the authentication flow
2. Connect to the backend API
3. Implement additional features as outlined in the NEXT_STEPS.md file 