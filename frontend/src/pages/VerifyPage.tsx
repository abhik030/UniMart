import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import Button from '../components/Button';
import PinInput from '../components/PinInput';
import { authService } from '../services/api';
import { env } from '../services/env';
import { UserResponseDTO } from '../types';

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

const JunkMailNote = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.secondary};
  margin-top: 0.75rem;
  text-align: center;
  font-style: italic;
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

const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.lightText};
  cursor: pointer;
`;

const ResendContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: underline;
  
  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;

const ResendTimer = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.lightText};
`;

const DebugMessage = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.875rem;
  text-align: left;
  color: #333;
`;

interface MessageContainerProps {
  messageType: 'success' | 'error';
}

const MessageContainer = styled.div<MessageContainerProps>`
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: ${props => props.theme.colors[props.messageType === 'success' ? 'success' : 'error']};
  color: ${props => props.theme.colors.text};
`;

const VerificationPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendMessageType, setResendMessageType] = useState<'success' | 'error'>('success');
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(true);
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
  
  useEffect(() => {
    // Start the timer for resend button
    if (!canResend && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!code || code.length !== 6) {
      setError('Please enter the complete 6-digit verification code');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      // Call the backend API to verify the code
      const response = await authService.verifyCode(email, code, rememberMe);
      
      // Store user data
      sessionStorage.setItem('email', email);
      sessionStorage.setItem('username', response.username || '');
      sessionStorage.setItem('universityName', response.universityName || response.university || '');
      sessionStorage.setItem('token', response.token);
      
      // If remember me is checked, store in localStorage as well
      if (rememberMe) {
        localStorage.setItem('email', email);
        localStorage.setItem('token', response.token);
        
        // Store trusted device token if provided
        if ((response as any).trustedDeviceToken) {
          localStorage.setItem('trustedDeviceToken', (response as any).trustedDeviceToken);
        }
      }
      
      console.log("Verification response:", response);
      
      // Store isFirstLogin flag in session storage
      sessionStorage.setItem('isFirstLogin', String(response.isFirstLogin === true));
      
      // Extract domain from email to check if it's directly supported
      const domain = email.split('@')[1];
      const isDirectlySupported = domain === 'northeastern.edu';
      sessionStorage.setItem('isDirectlySupported', String(isDirectlySupported));
      
      // For new users with unsupported schools, store a flag to indicate we need to go to profile setup after university selection
      if (response.isFirstLogin && !isDirectlySupported) {
        console.log("First-time login with unsupported school - storing flag for profile setup");
        sessionStorage.setItem('needsProfileSetup', 'true');
        navigate('/unsupported');
      } 
      // For new users with supported schools, go directly to profile setup
      else if (response.isFirstLogin && isDirectlySupported) {
        console.log("First-time login with supported school - redirecting to profile setup");
        navigate('/profile-setup');
      }
      // For returning users with unsupported school
      else if (!isDirectlySupported) {
        console.log("Returning user with unsupported school - redirecting to unsupported page");
        navigate('/unsupported');
      } 
      // For returning users with directly supported school
      else {
        console.log("Returning user with supported school - redirecting to marketplace");
        navigate('/huskymart');
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      // Call the API to resend the verification code
      await authService.resendCode(email);
      setResendMessage('Verification code resent successfully!');
      setResendMessageType('success');
      // Reset the timer
      setTimeLeft(60);
      setCanResend(false);
    } catch (error) {
      console.error('Error resending verification code:', error);
      setResendMessage('Failed to resend verification code. Please try again.');
      setResendMessageType('error');
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <Container>
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Logo size="medium" onClick={() => navigate('/')} />
        <Title>Verify Your Email</Title>
        
        <Form onSubmit={handleSubmit}>
          <PinInput 
            onChange={setCode}
            error={error}
          />
          
          <RememberMeContainer>
            <Checkbox 
              type="checkbox" 
              id="rememberMe" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <CheckboxLabel htmlFor="rememberMe">
              Remember me for 30 days
            </CheckboxLabel>
          </RememberMeContainer>
          
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
        
        <JunkMailNote>
          This may appear in your junk mail... university mail systems are a pain in my behind! 🙄
        </JunkMailNote>
        
        <ResendContainer>
          {canResend ? (
            <ResendButton onClick={handleResendCode} disabled={isResending}>
              {isResending ? 'Sending...' : 'Resend Code'}
            </ResendButton>
          ) : (
            <ResendTimer>Resend code in {timeLeft}s</ResendTimer>
          )}
        </ResendContainer>
        
        {resendMessage && (
          <MessageContainer messageType={resendMessageType}>
            {resendMessage}
          </MessageContainer>
        )}
      </Card>
    </Container>
  );
};

export default VerificationPage; 