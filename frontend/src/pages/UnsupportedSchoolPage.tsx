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
  margin-top: 2rem;
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

  const handleUniversityClick = (university: SupportedUniversityDTO) => {
    // Store university info in session storage
    sessionStorage.setItem('universityName', university.name);
    // Navigate to the marketplace
    navigate('/marketplace');
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
        <Title>School Not Supported</Title>
        <Subtitle>
          We're sorry, but your school is not currently supported. 
          Please choose from one of our supported universities below:
        </Subtitle>
        
        {loading ? (
          <LoadingText>Loading supported universities...</LoadingText>
        ) : (
          <UniversitiesList>
            {universities.map((university) => (
              <UniversityCard 
                key={university.id}
                onClick={() => handleUniversityClick(university)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <UniversityName>{university.name}</UniversityName>
                <MarketplaceName>{university.domain}</MarketplaceName>
              </UniversityCard>
            ))}
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