import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import theme from '../theme';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  color: ${props => props.theme.colors.text};
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${props => props.theme.colors.headerBg};
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
`;

const CartIcon = styled.svg`
  width: 24px;
  height: 24px;
  margin-right: 8px;
  fill: ${props => props.theme.colors.primary};
  transition: filter 0.3s ease, transform 0.3s ease;
  filter: drop-shadow(0 0 3px rgba(212, 27, 44, 0.5));
  position: relative;
  cursor: pointer;
  
  &:hover {
    filter: brightness(1.2) drop-shadow(0 0 5px rgba(212, 27, 44, 0.8));
    transform: scale(1.05);
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: white;
  
  .husky {
    color: white;
    transition: text-shadow 0.3s ease;
  }
  
  .mart {
    color: ${props => props.theme.colors.primary};
    transition: text-shadow 0.3s ease;
  }
  
  &:hover {
    .husky {
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
    }
    
    .mart {
      text-shadow: 0 0 10px rgba(212, 27, 44, 0.8);
    }
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  color: white;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.text};
`;

const Content = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: black;
  line-height: 1.6;
  
  h2 {
    color: black;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
  
  p, li {
    color: black;
    margin-bottom: 1rem;
  }
  
  ul {
    margin-left: 2rem;
    margin-bottom: 1rem;
  }
`;

const PrivacyNoticePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleCartClick = () => {
    navigate('/huskymart');
  };

  const handleBackClick = () => {
    if (location.state?.fromCheckout) {
      navigate('/checkout');
    } else {
      navigate(-1);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Header>
        <LogoContainer onClick={handleLogoClick}>
          <CartIcon viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </CartIcon>
          <HeaderTitle><span className="husky">Husky</span><span className="mart">Mart</span></HeaderTitle>
        </LogoContainer>
        
        <NavigationButtons>
          <NavButton onClick={handleBackClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Leave this Mumbo Jumbo (Previous Page)
          </NavButton>
        </NavigationButtons>
      </Header>

      <Container>
        <Title>Privacy Notice</Title>
        <Content>
          <h2>1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, including but not limited to:
          </p>
          <ul>
            <li>Name and contact information</li>
            <li>Account credentials</li>
            <li>Payment information</li>
            <li>User-generated content</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the collected information to:
          </p>
          <ul>
            <li>Provide and maintain our services</li>
            <li>Process transactions</li>
            <li>Send you important updates</li>
            <li>Improve our services</li>
            <li>Ensure platform security</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>
            We do not sell your personal information. We may share your information with:
          </p>
          <ul>
            <li>Service providers who assist in our operations</li>
            <li>Law enforcement when required by law</li>
            <li>Other users as necessary for transactions</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
          </p>

          <h2>5. Your Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <h2>6. Changes to Privacy Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </p>
        </Content>
      </Container>
    </ThemeProvider>
  );
};

export default PrivacyNoticePage; 