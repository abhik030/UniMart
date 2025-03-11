import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  fullWidth?: boolean;
}

const StyledButton = styled(motion.button)<{
  variant: string;
  fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  ${props => {
    switch(props.variant) {
      case 'primary':
        return `
          background-color: #00BFA6;
          color: white;
          border: none;
          &:hover {
            background-color: #00A896;
          }
          &:disabled {
            background-color: #4D4D4D;
            cursor: not-allowed;
          }
        `;
      case 'secondary':
        return `
          background-color: #1E1E1E;
          color: white;
          border: 2px solid #00BFA6;
          &:hover {
            background-color: rgba(0, 191, 166, 0.1);
          }
          &:disabled {
            border-color: #4D4D4D;
            color: #4D4D4D;
            cursor: not-allowed;
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: #00BFA6;
          border: 2px solid #00BFA6;
          &:hover {
            background-color: rgba(0, 191, 166, 0.1);
          }
          &:disabled {
            color: #4D4D4D;
            border-color: #4D4D4D;
            cursor: not-allowed;
          }
        `;
      default:
        return '';
    }
  }}
`;

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  fullWidth = false,
}) => {
  return (
    <StyledButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      fullWidth={fullWidth}
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
    >
      {children}
    </StyledButton>
  );
};

export default Button; 