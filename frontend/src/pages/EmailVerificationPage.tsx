import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import Input from '../components/Input';
import Button from '../components/Button';
import { authService } from '../services/api';
import { EmailValidationResponse } from '../types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: ${props => props.theme.colors.background};
`;

const Card = styled(motion.div)`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 1.5rem 0;
  color: ${props => props.theme.colors.text};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const HelpText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.lightText};
  margin-top: 0.5rem;
  text-align: center;
`;

const EmailVerificationPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    // Special case for developer account
    if (email !== 'studentunimart@gmail.com' && (!email.includes('@') || !email.endsWith('.edu'))) {
      setError('Please enter a valid .edu email address');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      // Always attempt to validate email and send verification code
      const response = await authService.validateEmail(email);
      
      // Store email in session storage for verification page
      sessionStorage.setItem('email', email);
      
      if (response.universityName) {
        sessionStorage.setItem('universityName', response.universityName);
      }
      
      // Always proceed to verification page, regardless of school support status
      navigate('/verify');
    } catch (err: any) {
      console.error('Email validation error:', err);
      
      if (err.response && err.response.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Unable to send verification code. Please check your email and try again.');
      }
    } finally {
      setLoading(false);
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
        <Title>Verify Your School Email</Title>
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            label="School Email Address"
            placeholder="doe.jane@northeastern.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            required
          />
          
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Verification Link'}
          </Button>
        </Form>
        
        <HelpText>
           School emails only.
        </HelpText>
      </Card>
    </Container>
  );
};

export default EmailVerificationPage; 