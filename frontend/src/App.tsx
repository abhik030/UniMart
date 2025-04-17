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
import CategoryPage from './pages/categories/CategoryPage';
import GlobalStyle from './styles/GlobalStyle';
import theme from './theme';
import { authService } from './services/api';
import LoginPage from './pages/LoginPage';
import VerifyPage from './pages/VerifyPage';
import SettingsPage from './pages/SettingsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ShoppingCartPage from './pages/ShoppingCartPage';
import CheckoutPage from './pages/CheckoutPage';
import BidManagementPage from './pages/BidManagementPage';
import UserAgreementPage from './pages/UserAgreementPage';
import PrivacyNoticePage from './pages/PrivacyNoticePage';

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
            {/* Authentication & Root Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/verify-email" element={<EmailVerificationPage />} />
            <Route path="/unsupported" element={<UnsupportedSchoolPage />} />
            <Route path="/email-test" element={<EmailTestPage />} />
            <Route path="/user-agreement" element={<UserAgreementPage />} />
            <Route path="/privacy" element={<PrivacyNoticePage />} />
            <Route 
              path="/profile-setup" 
              element={
                <ProtectedRoute>
                  <ProfileSetupPage />
                </ProtectedRoute>
              } 
            />

            {/* Marketplace Routes */}
            <Route path="/huskymart" element={<HuskyMartPage />} />
            <Route path="/huskymart/category/:category" element={<CategoryPage />} />
            <Route path="/northeastern" element={<Navigate to="/huskymart" replace />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/list-item" element={<ListYourItemPage />} />
            <Route path="/bids" element={<BidManagementPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/cart" element={<Navigate to="/shopping-cart" replace />} />
            <Route path="/shopping-cart" element={<ShoppingCartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
};

export default App; 