import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import Button from '../components/Button';
import { authService } from '../services/api';
import { SupportedUniversityDTO } from '../types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 2rem;
  background-color: ${props => props.theme.colors.background};
`;

const Card = styled(motion.div)`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-top: 2rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 2rem;
  text-align: center;
  line-height: 1.5;
`;

const UniversitiesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  width: 100%;
  margin-top: 2rem;
  margin-bottom: 3rem;
`;

const UniversityCard = styled(motion.div)`
  background-color: ${props => props.theme.colors.cardBackground};
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    background-color: rgba(0, 191, 166, 0.1);
  }
`;

const UniversityName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const MarketplaceName = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.primary};
`;

const LoadingText = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.lightText};
  margin: 2rem 0;
`;

const BackButton = styled(Button)`
  margin-top: 3rem;
`;

const UnsupportedSchoolPage: React.FC = () => {
  const [universities, setUniversities] = useState<SupportedUniversityDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get email from session storage
    const storedEmail = sessionStorage.getItem('email');
    
    if (!storedEmail) {
      // Redirect to home if no email is found
      navigate('/');
      return;
    }
    
    setEmail(storedEmail);
    
    // Fetch supported universities
    const fetchUniversities = async () => {
      try {
        const data = await authService.getSupportedUniversities();
        setUniversities(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUniversities();
  }, [navigate]);

  const handleUniversityClick = async (university: SupportedUniversityDTO) => {
    try {
      // Store university info in session storage
      sessionStorage.setItem('universityName', university.name);
      
      // Store the marketplace URL for redirection
      const marketplaceUrl = '/huskymart'; // For now, all universities redirect to HuskyMart
      sessionStorage.setItem('marketplaceUrl', marketplaceUrl);
      
      // Check if the user needs to complete profile setup (for new users)
      const needsProfileSetup = sessionStorage.getItem('needsProfileSetup') === 'true';
      
      if (needsProfileSetup) {
        // New users need to go to profile setup after selecting a university
        console.log("New user - redirecting to profile setup");
        // Remove the flag since we're handling it now
        sessionStorage.removeItem('needsProfileSetup');
        navigate('/profile-setup');
      } else {
        // Existing users go directly to the marketplace
        console.log("Existing user - redirecting to marketplace");
        navigate(marketplaceUrl);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };
  
  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Logo size="large" onClick={() => navigate('/')} />
      </motion.div>
      
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Title>Select a Marketplace</Title>
        <Subtitle>
          Thanks for verifying your email! Since your school {email ? `(${email})` : ''} doesn't have 
          its own marketplace yet, please select which marketplace you'd like to use below.
        </Subtitle>
        
        {loading ? (
          <LoadingText>Loading supported universities...</LoadingText>
        ) : (
          <UniversitiesList>
            {universities.map((university) => {
              // Custom display for Northeastern University
              const displayName = university.name === "Northeastern University" ? "HuskyMart" : university.name;
              const subtext = university.name === "Northeastern University" ? "Northeastern University" : university.domain;
              
              return (
                <UniversityCard 
                  key={university.id}
                  onClick={() => handleUniversityClick(university)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <UniversityName>{displayName}</UniversityName>
                  <MarketplaceName>{subtext}</MarketplaceName>
                </UniversityCard>
              );
            })}
          </UniversitiesList>
        )}
        
        <BackButton 
          variant="outline" 
          onClick={() => navigate('/')}
        >
          Back to Home
        </BackButton>
      </Card>
    </Container>
  );
};

export default UnsupportedSchoolPage; 