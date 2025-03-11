import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import Input from '../components/Input';
import Button from '../components/Button';
import { authService } from '../services/api';

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

const ResendLink = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-size: 0.875rem;
  margin-top: 1rem;
  cursor: pointer;
  text-decoration: underline;
  
  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;

const VerificationPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [universityName, setUniversityName] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get email from session storage
    const storedEmail = sessionStorage.getItem('email');
    const storedUniversityName = sessionStorage.getItem('universityName');
    
    if (!storedEmail) {
      // Redirect to home if no email is found
      navigate('/');
      return;
    }
    
    setEmail(storedEmail);
    
    if (storedUniversityName) {
      setUniversityName(storedUniversityName);
    }
  }, [navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!code) {
      setError('Please enter the verification code');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const response = await authService.verifyCode(email, code);
      // Store user data
      sessionStorage.setItem('username', response.username);
      sessionStorage.setItem('token', response.token);
      
      // Redirect to the marketplace
      navigate('/marketplace');
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError('An error occurred. Please try again.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await authService.resendCode(email);
      setError('');
      alert('A new verification code has been sent to your email.');
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Logo size="large" />
      </motion.div>
      
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Title>Enter Verification Code</Title>
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            label="Verification Code"
            placeholder="Enter the 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            error={error}
            required
            maxLength={6}
          />
          
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </Button>
        </Form>
        
        <HelpText>
          We've sent a verification code to {email}
        </HelpText>
        
        <ResendLink onClick={handleResendCode}>
          Didn't receive a code? Click to resend
        </ResendLink>
      </Card>
    </Container>
  );
};

export default VerificationPage; 