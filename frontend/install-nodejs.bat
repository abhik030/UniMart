@echo off
echo Installing Node.js LTS...
echo.
echo This script will download and install Node.js LTS for Windows.
echo.
echo Please wait while we download the installer...

:: Create a temporary directory
mkdir %TEMP%\nodejs-install
cd %TEMP%\nodejs-install

:: Download Node.js installer
echo Downloading Node.js installer...
powershell -Command "& {Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi' -OutFile 'node-installer.msi'}"

:: Run the installer
echo.
echo Running the installer...
echo Please follow the installation wizard.
echo.
start /wait msiexec /i node-installer.msi /qn

:: Clean up
cd %USERPROFILE%
rmdir /s /q %TEMP%\nodejs-install

echo.
echo Installation complete!
echo Please restart your PowerShell or command prompt to use Node.js and npm.
echo.
echo After restarting, you can verify the installation by running:
echo   node -v
echo   npm -v
echo.
echo Then you can install the dependencies and start the application:
echo   cd frontend
echo   npm install
echo   npm start
echo.
pause 