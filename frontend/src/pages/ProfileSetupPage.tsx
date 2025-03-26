import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import Button from '../components/Button';
import { authService } from '../services/api';
import { ProfileSetupRequest } from '../types';

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
  max-width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 1.5rem 0;
  color: ${props => props.theme.colors.text};
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: left;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background-color: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  font-weight: 500;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryLight};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.lightText};
    opacity: 0.7;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background-color: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  font-weight: 500;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryLight};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.lightText};
    opacity: 0.7;
  }
`;

const ErrorText = styled.p`
  color: ${props => props.theme.colors.error};
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const ProfilePictureContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfilePicturePreview = styled.div<{ hasImage: boolean }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: ${props => props.hasImage ? 'transparent' : props.theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  overflow: hidden;
  border: 2px solid ${props => props.theme.colors.primary};
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileIcon = styled.svg`
  width: 60px;
  height: 60px;
  fill: ${props => props.theme.colors.primary};
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
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

const ProfileSetupPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [description, setDescription] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get email from session storage
    const storedEmail = sessionStorage.getItem('email');
    const token = sessionStorage.getItem('token');
    
    if (!storedEmail || !token) {
      // Redirect to home if no email or token is found
      console.log('No email or token found, redirecting to home');
      navigate('/');
      return;
    }
    
    console.log('Email found in session storage:', storedEmail);
    setEmail(storedEmail);
  }, [navigate]);
  
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate form data
      if (!validateForm()) {
        throw new Error('Form validation failed');
      }
      
      // Get email from session storage
      const email = sessionStorage.getItem('email');
      
      if (!email) {
        throw new Error('Email not found. Please try logging in again');
      }
      
      const profileData: ProfileSetupRequest = {
        firstName,
        lastName,
        phoneNumber,
        description: description.trim() || undefined,
        profilePicture: profilePicture
      };
      
      console.log('Profile data:', profileData);
      
      const response = await authService.setupProfile(profileData, email);
      console.log('Profile setup response:', response);
      
      // Store user profile info in session storage
      sessionStorage.setItem('firstName', response.firstName);
      sessionStorage.setItem('lastName', response.lastName);
      sessionStorage.setItem('token', response.token);
      if (response.profilePictureUrl) {
        sessionStorage.setItem('profilePictureUrl', response.profilePictureUrl);
      }
      
      // After completing profile setup, go directly to the marketplace
      console.log("Profile setup complete - redirecting to marketplace");
      navigate('/huskymart');
    } catch (error: any) {
      console.error('Profile setup error:', error);
      let errorMessage = 'An error occurred while setting up your profile. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors({
        form: errorMessage
      });
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
        <Logo size="large" />
      </motion.div>
      
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Title>Complete Your Profile</Title>
        <Subtitle>
          Please provide some additional information to complete your account setup.
        </Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <ProfilePictureContainer>
            <ProfilePicturePreview hasImage={!!profilePicturePreview}>
              {profilePicturePreview ? (
                <ProfileImage src={profilePicturePreview} alt="Profile Preview" />
              ) : (
                <ProfileIcon viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </ProfileIcon>
              )}
            </ProfilePicturePreview>
            <FileInput
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              ref={fileInputRef}
            />
            <UploadButton type="button" onClick={triggerFileInput}>
              {profilePicturePreview ? 'Change Profile Picture' : 'Upload Profile Picture'}
            </UploadButton>
          </ProfilePictureContainer>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="firstName">First Name*</Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              {errors.firstName && <ErrorText>{errors.firstName}</ErrorText>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="lastName">Last Name*</Label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              {errors.lastName && <ErrorText>{errors.lastName}</ErrorText>}
            </FormGroup>
          </FormRow>
          
          <FormGroup style={{ marginBottom: '1.5rem' }}>
            <Label htmlFor="phoneNumber">Phone Number*</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="(123) 456-7890"
              required
            />
            {errors.phoneNumber && <ErrorText>{errors.phoneNumber}</ErrorText>}
          </FormGroup>
          
          <FormGroup style={{ marginBottom: '1.5rem' }}>
            <Label htmlFor="description">About Me (Optional)</Label>
            <TextArea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us a bit about yourself..."
            />
          </FormGroup>
          
          {errors.form && <ErrorText style={{ textAlign: 'center', marginBottom: '1rem' }}>{errors.form}</ErrorText>}
          
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Complete Setup'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default ProfileSetupPage; 