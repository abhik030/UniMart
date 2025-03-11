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
`;

const Header = styled.header`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 6rem;
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

const StyledButton = styled(motion.div)`
  margin-top: 1rem;
`;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/verify-email');
  };

  return (
    <Container>
      <Header>
        <Logo size="medium" onClick={() => navigate('/')} />
      </Header>

      <Content>
        <Title
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to Student Marketplace
        </Title>
        
        <Subtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Your one-stop platform for buying and selling among students.
        </Subtitle>
        
        <StyledButton
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button 
            variant="primary" 
            onClick={handleGetStarted}
            fullWidth={false}
          >
            Get Started
          </Button>
        </StyledButton>
      </Content>
    </Container>
  );
};

export default LandingPage; 