import React, { useState } from 'react';
import styled from 'styled-components';
import { authService } from '../services/api';
import Button from '../components/Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const Card = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.secondary};
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryLight};
  }
`;

const StatusMessage = styled.div<{ isError: boolean }>`
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  background-color: ${props => props.isError ? 'rgba(254, 226, 226, 0.1)' : 'rgba(209, 250, 229, 0.1)'};
  color: ${props => props.isError ? props.theme.colors.error : props.theme.colors.success};
  text-align: center;
`;

const EmailTestPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus({ message: 'Please enter an email address', isError: true });
      return;
    }
    
    setLoading(true);
    setStatus(null);
    
    try {
      // Use the backend API to send a verification email
      const response = await authService.validateEmail(email);
      
      setStatus({ 
        message: `Verification email sent successfully to ${email}. ${response.message}`, 
        isError: false 
      });
    } catch (error: any) {
      console.error('Error sending email:', error);
      setStatus({ 
        message: `Failed to send email: ${error.response?.data || (error instanceof Error ? error.message : 'Unknown error')}`, 
        isError: true 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>Email Service Test</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button 
            type="submit" 
            disabled={loading}
            fullWidth
          >
            {loading ? 'Sending...' : 'Send Test Email'}
          </Button>
        </Form>
        
        {status && (
          <StatusMessage isError={status.isError}>
            {status.message}
          </StatusMessage>
        )}
      </Card>
    </Container>
  );
};

export default EmailTestPage; 