import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  error?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
}

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  width: 100%;
`;

const Label = styled.label`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #FFFFFF;
  font-weight: 500;
`;

const StyledInput = styled(motion.input)<{ hasError?: boolean }>`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 2px solid ${props => props.hasError ? '#FF5252' : '#333333'};
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;
  background-color: #FFFFFF;
  color: #121212;
  
  &:focus {
    border-color: ${props => props.hasError ? '#FF5252' : '#00BFA6'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(255, 82, 82, 0.2)' : 'rgba(0, 191, 166, 0.2)'};
  }
  
  &:disabled {
    background-color: #333333;
    color: #AAAAAA;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  color: #FF5252;
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  id,
  error,
  label,
  required = false,
  disabled = false,
  maxLength,
}) => {
  return (
    <InputContainer>
      {label && (
        <Label htmlFor={id || name}>
          {label} {required && <span style={{ color: '#FF5252' }}>*</span>}
        </Label>
      )}
      <StyledInput
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        id={id || name}
        hasError={!!error}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        whileFocus={{ scale: 1.01 }}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};

export default Input;