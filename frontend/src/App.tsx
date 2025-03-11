import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import LandingPage from './pages/LandingPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import VerificationPage from './pages/VerificationPage';
import UnsupportedSchoolPage from './pages/UnsupportedSchoolPage';
import MarketplacePage from './pages/MarketplacePage';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';

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
            <Route 
              path="/marketplace" 
              element={
                <ProtectedRoute>
                  <MarketplacePage />
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