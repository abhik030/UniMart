import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { motion } from 'framer-motion';
import Button from '../components/Button';

// Northeastern University colors
const huskyTheme = {
  colors: {
    primary: '#CC0000', // Northeastern Red
    secondary: '#000000', // Black
    accent: '#D41B2C', // Brighter Red
    background: '#F5F5F5', // Light Gray
    cardBackground: '#FFFFFF', // White
    card: '#FFFFFF', // Added to match global theme
    text: '#000000', // Black
    lightText: '#666666', // Gray
    border: '#DDDDDD',
    error: '#CC0000',
    success: '#28A745',
    inputBackground: '#FFFFFF',
    primaryLight: 'rgba(204, 0, 0, 0.1)', // Transparent Red
  },
  fonts: {
    body: "'Inter', sans-serif",
    heading: "'Inter', sans-serif",
  },
  fontSizes: {
    small: '0.875rem',
    medium: '1rem',
    large: '1.25rem',
    xlarge: '1.5rem',
    xxlarge: '2rem',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    small: '0.25rem',
    medium: '0.5rem',
    large: '1rem',
    full: '9999px',
  },
  shadows: {
    small: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    medium: '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)',
    large: '0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10)',
  },
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  fill: white;
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: white;
  
  span {
    color: ${props => props.theme.colors.primary};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
`;

const UserName = styled.span`
  font-weight: 500;
`;

const ProfilePicture = styled.div<{ hasImage: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.hasImage ? 'transparent' : props.theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid white;
  cursor: pointer;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileIcon = styled.svg`
  width: 24px;
  height: 24px;
  fill: white;
`;

const ProfileDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  width: 200px;
  z-index: 100;
`;

const ProfileMenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background-color: white;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: ${props => props.theme.colors.text};
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryLight};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`;

const MenuIcon = styled.svg`
  width: 18px;
  height: 18px;
  fill: ${props => props.theme.colors.text};
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const WelcomeSection = styled.section`
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.primary};
`;

const WelcomeText = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
`;

const ComingSoonBanner = styled(motion.div)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  margin-top: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ComingSoonText = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const ComingSoonDescription = styled.p`
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
`;

const FeaturedSection = styled.section`
  margin-top: 3rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};
  border-bottom: 2px solid ${props => props.theme.colors.primary};
  padding-bottom: 0.5rem;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const Card = styled(motion.div)`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const CardImage = styled.div`
  height: 150px;
  background-color: ${props => props.theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const CardTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const CardDescription = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
`;

const Footer = styled.footer`
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  padding: 1.5rem;
  text-align: center;
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 0.9rem;
`;

const MarketSwitcherContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;
`;

const MarketSwitcherButton = styled(motion.button)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background-color: ${props => props.theme.colors.accent};
  }
`;

const MarketDropdown = styled(motion.div)`
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 0.5rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  width: 250px;
`;

const MarketOption = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  border: none;
  background-color: white;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryLight};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`;

const MarketIcon = styled.div<{ bgColor: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.bgColor};
`;

const HuskyMartPage: React.FC = () => {
  const [showMarketDropdown, setShowMarketDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [universityName, setUniversityName] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    
    // Get user data from session storage
    const storedFirstName = sessionStorage.getItem('firstName');
    const storedLastName = sessionStorage.getItem('lastName');
    const storedProfilePictureUrl = sessionStorage.getItem('profilePictureUrl');
    const storedUniversityName = sessionStorage.getItem('universityName');
    
    if (storedFirstName) setFirstName(storedFirstName);
    if (storedLastName) setLastName(storedLastName);
    if (storedProfilePictureUrl) setProfilePictureUrl(storedProfilePictureUrl);
    if (storedUniversityName) setUniversityName(storedUniversityName);
  }, [navigate]);
  
  const handleLogout = () => {
    // Clear session storage
    sessionStorage.clear();
    // Redirect to home
    navigate('/');
  };
  
  const toggleMarketDropdown = () => {
    setShowMarketDropdown(prev => !prev);
    // Close profile dropdown if open
    if (showProfileDropdown) setShowProfileDropdown(false);
  };
  
  const toggleProfileDropdown = () => {
    setShowProfileDropdown(prev => !prev);
    // Close market dropdown if open
    if (showMarketDropdown) setShowMarketDropdown(false);
  };
  
  const handleMarketChange = (path: string) => {
    navigate(path);
    setShowMarketDropdown(false);
  };
  
  const handleLogoClick = () => {
    // Refresh the page or navigate to the same page
    navigate('/huskymart');
  };
  
  const handleSettingsClick = () => {
    // Navigate to settings page (to be implemented)
    setShowProfileDropdown(false);
    // For now, just close the dropdown
    // navigate('/settings');
  };
  
  return (
    <ThemeProvider theme={huskyTheme}>
      <Container>
        <Header>
          <LogoContainer onClick={handleLogoClick}>
            <CartIcon viewBox="0 0 24 24">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </CartIcon>
            <HeaderTitle>Husky<span>Mart</span></HeaderTitle>
          </LogoContainer>
          
          <UserInfo>
            <UserName>
              {firstName ? `${firstName} ${lastName}` : 'User'}
            </UserName>
            
            <ProfilePicture 
              hasImage={!!profilePictureUrl} 
              onClick={toggleProfileDropdown}
            >
              {profilePictureUrl ? (
                <ProfileImage src={profilePictureUrl} alt="Profile" />
              ) : (
                <ProfileIcon viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </ProfileIcon>
              )}
            </ProfilePicture>
            
            {showProfileDropdown && (
              <ProfileDropdown
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ProfileMenuItem onClick={handleSettingsClick}>
                  <MenuIcon viewBox="0 0 24 24">
                    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
                  </MenuIcon>
                  Settings
                </ProfileMenuItem>
                <ProfileMenuItem onClick={handleLogout}>
                  <MenuIcon viewBox="0 0 24 24">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                  </MenuIcon>
                  Sign Out
                </ProfileMenuItem>
              </ProfileDropdown>
            )}
          </UserInfo>
        </Header>
        
        <MainContent>
          <WelcomeSection>
            <WelcomeTitle>Welcome to HuskyMart</WelcomeTitle>
            <WelcomeText>
              Your one-stop marketplace for Northeastern University students. Buy, sell, and trade items with your fellow Huskies.
            </WelcomeText>
          </WelcomeSection>
          
          <ComingSoonBanner
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ComingSoonText>Coming Soon!</ComingSoonText>
            <ComingSoonDescription>
              We're working hard to bring you the best marketplace experience for Northeastern students. 
              Check back soon for exciting updates!
            </ComingSoonDescription>
          </ComingSoonBanner>
          
          <FeaturedSection>
            <SectionTitle>Featured Categories</SectionTitle>
            <CardGrid>
              {['Textbooks', 'Electronics', 'Furniture', 'Clothing'].map((category) => (
                <Card 
                  key={category}
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardImage>{category}</CardImage>
                  <CardContent>
                    <CardTitle>{category}</CardTitle>
                    <CardDescription>
                      Find great deals on {category.toLowerCase()} from fellow Northeastern students.
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </CardGrid>
          </FeaturedSection>
        </MainContent>
        
        <MarketSwitcherContainer>
          <MarketSwitcherButton
            onClick={toggleMarketDropdown}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Want to change marts?
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10l5 5 5-5H7z" fill="currentColor" />
            </svg>
          </MarketSwitcherButton>
          
          {showMarketDropdown && (
            <MarketDropdown
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <MarketOption 
                key="HuskyMart"
                onClick={() => handleMarketChange('/huskymart')}
              >
                <MarketIcon bgColor="#CC0000" />
                HuskyMart
              </MarketOption>
            </MarketDropdown>
          )}
        </MarketSwitcherContainer>
        
        <Footer>
          <FooterText>© 2025 HuskyMart - A marketplace for Northeastern University students</FooterText>
        </Footer>
      </Container>
    </ThemeProvider>
  );
};

export default HuskyMartPage; 