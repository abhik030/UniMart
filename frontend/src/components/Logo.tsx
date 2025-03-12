import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

export interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  textColor?: string;
  accentColor?: string;
}

const LogoContainer = styled(motion.div)<{ size: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
`;

const LogoText = styled.h1<{ size: string; textColor: string }>`
  font-size: ${props => {
    switch(props.size) {
      case 'small': return '1.5rem';
      case 'large': return '3rem';
      default: return '2rem';
    }
  }};
  font-weight: bold;
  margin: 0;
  color: ${props => props.textColor};
`;

const LogoAccent = styled.span<{ accentColor: string }>`
  color: ${props => props.accentColor};
`;

const CartIcon = styled.svg<{ accentColor: string }>`
  width: ${props => props.width || '24px'};
  height: ${props => props.height || '24px'};
  margin-right: 8px;
  fill: ${props => props.accentColor};
`;

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  onClick, 
  textColor = '#FFFFFF',
  accentColor = '#00BFA6'
}) => {
  return (
    <LogoContainer 
      size={size}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
    >
      <CartIcon 
        viewBox="0 0 24 24" 
        accentColor={accentColor}
      >
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
      </CartIcon>
      <LogoText size={size} textColor={textColor}>
        Uni<LogoAccent accentColor={accentColor}>Mart</LogoAccent>
      </LogoText>
    </LogoContainer>
  );
};

export default Logo; 