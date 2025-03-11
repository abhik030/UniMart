# Installing Node.js and npm

To run the UniMart frontend, you need to have Node.js and npm (Node Package Manager) installed on your system. Follow these steps to install them:

## Windows

1. Visit the official Node.js website: [https://nodejs.org/](https://nodejs.org/)
2. Download the LTS (Long Term Support) version, which is recommended for most users
3. Run the installer and follow the installation wizard
4. Accept the license agreement and click "Next"
5. Choose the installation location (default is recommended) and click "Next"
6. In the custom setup step, ensure that "npm package manager" is selected to be installed
7. Click "Install" to begin the installation
8. Once completed, click "Finish"

To verify the installation:
1. Open Command Prompt or PowerShell
2. Run the following commands:
   ```
   node -v
   npm -v
   ```
3. Both commands should display version numbers, confirming successful installation

## macOS

### Using the Installer
1. Visit [https://nodejs.org/](https://nodejs.org/)
2. Download the LTS version for macOS
3. Run the installer package and follow the instructions
4. Verify installation with `node -v` and `npm -v` in Terminal

### Using Homebrew (recommended if you have Homebrew)
1. Open Terminal
2. Install Homebrew if you don't have it: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
3. Install Node.js: `brew install node`
4. Verify installation with `node -v` and `npm -v`

## Linux

### Ubuntu/Debian
```
sudo apt update
sudo apt install nodejs npm
node -v
npm -v
```

### Fedora
```
sudo dnf install nodejs npm
node -v
npm -v
```

### Using NVM (Node Version Manager) - Recommended for all Linux distributions
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc  # or source ~/.zshrc if using zsh
nvm install --lts
node -v
npm -v
```

## After Installation

Once Node.js and npm are installed, you can proceed with installing the project dependencies:

1. Navigate to the project directory in your terminal/command prompt
2. Run `npm install` to install all required dependencies
3. After installation completes, run `npm start` to start the development server 