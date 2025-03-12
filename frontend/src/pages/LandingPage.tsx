import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import Button from '../components/Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 2rem;
  background-color: ${props => props.theme.colors.background};
  position: relative;
  overflow: hidden;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 4rem;
  position: relative;
  z-index: 1;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled.a`
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const Content = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  text-align: center;
  margin-top: 2rem;
  position: relative;
  z-index: 1;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.primary};
  line-height: 1.2;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 3rem;
  line-height: 1.6;
  max-width: 600px;
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const FeatureSection = styled(motion.section)`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1000px;
  margin-top: 6rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const FeatureCard = styled(motion.div)`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 1.5rem;
  width: 30%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(0, 191, 166, 0.2);
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: ${props => props.theme.colors.text};
`;

const FeatureDescription = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
`;

const Footer = styled.footer`
  width: 100%;
  max-width: 1200px;
  margin-top: 6rem;
  padding-top: 2rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  text-align: center;
  color: ${props => props.theme.colors.lightText};
  font-size: 0.875rem;
  position: relative;
  z-index: 1;
`;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/verify-email');
  };

  return (
    <Container>
      <Header>
        <Logo />
        <NavLinks>
          <NavLink href="#about">About</NavLink>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#contact">Contact</NavLink>
        </NavLinks>
      </Header>
      
      <Content>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to Student Marketplace
        </Title>
        
        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Your one-stop platform for buying and selling among students.
          Connect with peers, find what you need, and sell what you don't -
          all within your university community.
        </Subtitle>
        
        <ButtonContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button onClick={handleGetStarted}>Get Started</Button>
          <Button variant="secondary" onClick={() => {}}>Learn More</Button>
        </ButtonContainer>
      </Content>
      
      <FeatureSection
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <FeatureCard>
          <FeatureIcon>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#CC0000"/>
            </svg>
          </FeatureIcon>
          <FeatureTitle>Student Verified</FeatureTitle>
          <FeatureDescription>
            Only verified university students can access the marketplace, ensuring a trusted community.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fill="#CC0000"/>
            </svg>
          </FeatureIcon>
          <FeatureTitle>Campus Specific</FeatureTitle>
          <FeatureDescription>
            Find items from students on your campus, making exchanges convenient and local.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="#CC0000"/>
            </svg>
          </FeatureIcon>
          <FeatureTitle>Secure Messaging</FeatureTitle>
          <FeatureDescription>
            Communicate safely with other students through our built-in messaging system.
          </FeatureDescription>
        </FeatureCard>
      </FeatureSection>
      
      <Footer>
        © {new Date().getFullYear()} Student Marketplace. All rights reserved.
      </Footer>
    </Container>
  );
};

export default LandingPage; 