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
  style?: React.CSSProperties;
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
          background-color: ${props.theme.colors.primary};
          color: white;
          border: none;
          &:hover {
            background-color: ${props.theme.colors.secondary};
          }
          &:disabled {
            background-color: #4D4D4D;
            cursor: not-allowed;
          }
        `;
      case 'secondary':
        return `
          background-color: ${props.theme.colors.background};
          color: white;
          border: 2px solid ${props.theme.colors.primary};
          &:hover {
            background-color: ${props.theme.colors.primaryLight};
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
          color: ${props.theme.colors.primary};
          border: 2px solid ${props.theme.colors.primary};
          &:hover {
            background-color: ${props.theme.colors.primaryLight};
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
  style,
}) => {
  return (
    <StyledButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      fullWidth={fullWidth}
      style={style}
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
    >
      {children}
    </StyledButton>
  );
};

export default Button; 