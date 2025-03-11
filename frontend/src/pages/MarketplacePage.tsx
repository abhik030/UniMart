import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import Button from '../components/Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: ${props => props.theme.colors.background};
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 3rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled.span`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  margin-right: 1rem;
`;

const Content = styled.main`
  width: 100%;
  max-width: 1200px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
  color: ${props => props.theme.colors.text};
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 2rem;
  text-align: center;
  line-height: 1.5;
`;

const ComingSoonBanner = styled.div`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 2rem;
  width: 100%;
`;

const MarketplacePage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [universityName, setUniversityName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from session storage
    const storedUsername = sessionStorage.getItem('username');
    const storedUniversityName = sessionStorage.getItem('universityName');
    
    if (!sessionStorage.getItem('token')) {
      // Redirect to home if not authenticated
      navigate('/');
      return;
    }
    
    if (storedUsername) {
      setUsername(storedUsername);
    }
    
    if (storedUniversityName) {
      setUniversityName(storedUniversityName);
    } else {
      setUniversityName('UniMart');
    }
  }, [navigate]);

  const handleSignOut = () => {
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <Container>
      <Header>
        <Logo size="small" onClick={() => navigate('/marketplace')} />
        <UserInfo>
          {username && <UserName>Hello, {username}</UserName>}
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </UserInfo>
      </Header>

      <Content>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title>Welcome to {universityName} Marketplace</Title>
          <Subtitle>
            Your university marketplace for buying and selling items
          </Subtitle>
          
          <ComingSoonBanner>
            <h2>Coming Soon!</h2>
            <p>We're still building the marketplace features. Check back soon!</p>
          </ComingSoonBanner>
        </motion.div>
      </Content>
    </Container>
  );
};

export default MarketplacePage; 