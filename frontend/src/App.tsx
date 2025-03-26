import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import LandingPage from './pages/LandingPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import VerificationPage from './pages/VerificationPage';
import UnsupportedSchoolPage from './pages/UnsupportedSchoolPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import HuskyMartPage from './pages/HuskyMartPage';
import EmailTestPage from './pages/EmailTestPage';
import ListYourItemPage from './pages/ListYourItemPage';
import MessagesPage from './pages/MessagesPage';
import GlobalStyle from './styles/GlobalStyle';
import theme from './theme';
import { authService } from './services/api';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = sessionStorage.getItem('token') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  useEffect(() => {
    // Check if we have a stored email and token in localStorage (remember me)
    const storedEmail = localStorage.getItem('email');
    const storedToken = localStorage.getItem('token');
    
    if (storedEmail && storedToken) {
      // Check if the token is valid
      const isValid = authService.checkRememberMeToken(storedEmail);
      
      if (isValid) {
        console.log('Valid remember me token found, restoring session');
        // Restore the session
        sessionStorage.setItem('email', storedEmail);
        sessionStorage.setItem('token', storedToken);
      } else {
        console.log('Remember me token expired or invalid, clearing localStorage');
        // Clear localStorage if token is invalid
        localStorage.removeItem('email');
        localStorage.removeItem('token');
      }
    }
  }, []);
  
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <AppContainer>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/verify-email" element={<EmailVerificationPage />} />
            <Route path="/verify" element={<VerificationPage />} />
            <Route path="/unsupported" element={<UnsupportedSchoolPage />} />
            <Route path="/email-test" element={<EmailTestPage />} />
            <Route 
              path="/profile-setup" 
              element={
                <ProtectedRoute>
                  <ProfileSetupPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/huskymart" 
              element={
                <ProtectedRoute>
                  <HuskyMartPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/northeastern" 
              element={
                <ProtectedRoute>
                  <HuskyMartPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/marketplace" element={<Navigate to="/huskymart" replace />} />
            <Route 
              path="/list-item" 
              element={
                <ProtectedRoute>
                  <ListYourItemPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
};

export default App; 