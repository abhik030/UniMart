import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Input from '../components/Input';

// Northeastern University colors
const huskyTheme = {
  colors: {
    primary: '#D41B2C', // Northeastern Red
    secondary: '#000000', // Black
    accent: '#D41B2C', // Updated to match primary Northeastern Red
    background: '#FFFFFF', // White background
    cardBackground: '#FFFFFF', // White
    card: '#FFFFFF', // Added to match global theme
    text: '#000000', // Black
    lightText: '#666666', // Gray
    border: '#DDDDDD',
    error: '#D41B2C', // Updated to match Northeastern Red
    success: '#28A745',
    inputBackground: '#FFFFFF',
    primaryLight: 'rgba(212, 27, 44, 0.1)', // Transparent Red
    teal: '#00BFB3', // Teal color for cart icon
    headerBg: '#000000', // Black header background
    navBg: '#EFEFEF', // Light gray for navigation
  },
  fonts: {
    body: "'Inter', sans-serif",
    heading: "'Inter', sans-serif",
  },
  fontSizes: {
    small: '0.875rem',
    medium: '1rem',
    large: '1.25rem',
    xlarge: '1.5rem',
    xxlarge: '2rem',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    small: '0.25rem',
    medium: '0.5rem',
    large: '1rem',
    full: '9999px',
  },
  shadows: {
    small: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    medium: '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)',
    large: '0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10)',
  },
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 2rem;
  background-color: ${props => props.theme.colors.headerBg};
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CartIcon = styled.svg`
  width: 24px;
  height: 24px;
  margin-right: 8px;
  fill: ${props => props.theme.colors.primary};
  transition: filter 0.3s ease, transform 0.3s ease;
  filter: drop-shadow(0 0 3px rgba(212, 27, 44, 0.5));
  position: relative;
  cursor: pointer;
  
  &:hover {
    filter: brightness(1.2) drop-shadow(0 0 5px rgba(212, 27, 44, 0.8));
    transform: scale(1.05);
  }
`;

const CartTooltip = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  left: 50%;
  transform: translateX(-50%);
  background-color: ${props => props.theme.colors.headerBg};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  white-space: nowrap;
  z-index: 1000;
  
  ${CartIcon}:hover + & {
    opacity: 1;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: white;
  cursor: pointer;
  
  .husky {
    color: white;
    transition: text-shadow 0.3s ease;
  }
  
  .mart {
    color: ${props => props.theme.colors.primary};
    transition: text-shadow 0.3s ease;
  }
  
  &:hover {
    .husky {
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
    }
    
    .mart {
      text-shadow: 0 0 10px rgba(212, 27, 44, 0.8);
    }
  }
`;

const SearchContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(600px, 40vw);
  max-width: 40%;
  min-width: 250px;
  
  @media (max-width: 768px) {
    width: min(500px, 35vw);
    max-width: 35%;
    min-width: 200px;
  }
`;

const SearchBar = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.6rem 1.2rem 0.6rem 2.2rem;
  border-radius: 20px;
  border: none;
  background-color: white;
  color: ${props => props.theme.colors.text};
  font-size: clamp(0.85rem, 1vw, 1rem);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &::placeholder {
    color: #999;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary};
    transform: scale(1.02);
  }
`;

const SearchIcon = styled.svg`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  fill: #999;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
  position: relative;
`;

// Add new IconTooltip styled component
const IconTooltip = styled.div`
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${props => props.theme.colors.headerBg};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  white-space: nowrap;
  z-index: 100;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  position: relative;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    
    ${IconTooltip} {
      opacity: 1;
    }
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ListProductButton = styled(Button)`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: white;
  padding: 0;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  
  svg {
    width: 22px;
    height: 22px;
    fill: ${props => props.theme.colors.primary};
  }
  
  &:hover {
    background-color: #f8f8f8;
    transform: scale(1.05);
  }
  
  &:hover::after {
    content: "CONTACT US";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: ${props => props.theme.colors.headerBg};
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: bold;
    white-space: nowrap;
    margin-top: 8px;
    letter-spacing: 1px;
  }
`;

const UserInfo = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const ProfilePicture = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  background-color: ${props => props.theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ShoppingCartButton = styled(motion.button)<{ isProfileOpen?: boolean }>`
  position: fixed;
  top: ${props => props.isProfileOpen ? 'calc(5rem + 200px)' : '5rem'};
  right: 2rem;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  border: none;
  box-shadow: ${props => props.theme.shadows.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: top 0.3s ease;
  
  svg {
    width: 20px;
    height: 20px;
    fill: white;
  }
  
  &:hover {
    transform: scale(1.1);
  }
`;

const ProfileIcon = styled.svg`
  width: 24px;
  height: 24px;
  fill: white;
`;

const ProfileDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  width: 200px;
  z-index: 100;
`;

const ProfileMenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background-color: white;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: ${props => props.theme.colors.text};
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryLight};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`;

const MenuIcon = styled.svg`
  width: 18px;
  height: 18px;
  fill: ${props => props.theme.colors.text};
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

// Hero section components
const HeroSection = styled(motion.section)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 3rem 4rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  overflow: hidden;
  position: relative;
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 2rem;
  }
`;

const HeroContent = styled(motion.div)`
  max-width: 50%;
  z-index: 1;
  
  @media (max-width: 768px) {
    max-width: 100%;
    text-align: center;
    margin-bottom: 2rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  opacity: 0.9;
`;

const HeroImage = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 50%;
  background-color: rgba(0, 0, 0, 0.2);
  background-image: url('/Welcome1400.webp');
  background-size: cover;
  background-position: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// Layout components
const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const MainColumn = styled.div``;

const SideColumn = styled.div``;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.primary};
  border-bottom: 2px solid ${props => props.theme.colors.primary};
  padding-bottom: 0.5rem;
`;

const WelcomeSection = styled.section`
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.primary};
`;

const WelcomeText = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
`;

const ComingSoonBanner = styled(motion.div)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  margin-top: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ComingSoonText = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const ComingSoonDescription = styled.p`
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
`;

const FeaturedSection = styled.section`
  margin-top: 3rem;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const Card = styled(motion.div)`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const CardImage = styled.div`
  height: 150px;
  background-color: ${props => props.theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const CardTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const CardDescription = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
`;

const Footer = styled.footer`
  background-color: ${props => props.theme.colors.headerBg};
  color: white;
  padding: 1.5rem;
  text-align: center;
  margin-top: 2rem;
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: white;
  
  a {
    color: white;
    text-decoration: underline;
    margin: 0 0.25rem;
    
    &:hover {
      color: ${props => props.theme.colors.primaryLight};
    }
  }
`;

const MarketSwitcherContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;
`;

const MarketSwitcherButton = styled(motion.button)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  width: 45px;
  overflow: hidden;
  white-space: nowrap;
  
  svg {
    margin-left: 0;
    transition: margin 0.3s ease;
  }
  
  span {
    max-width: 0;
    opacity: 0;
    transition: max-width 0.3s ease, opacity 0.2s ease, margin 0.3s ease;
    margin-right: 0;
  }
  
  &:hover {
    width: 200px;
    padding: 0.75rem 1.25rem;
    
    span {
      max-width: 150px;
      opacity: 1;
      margin-right: 8px;
    }
    
    svg {
      margin-left: 5px;
    }
  }
`;

const MarketDropdown = styled(motion.div)`
  position: absolute;
  bottom: 100%;
  left: 0;
  margin-bottom: 0.5rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  width: 250px;
`;

const MarketOption = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem;
  border: none;
  background-color: white;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-weight: 500;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryLight};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`;

const MarketIcon = styled.div<{ bgColor: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    content: "";
    display: block;
    width: 14px;
    height: 14px;
    background-color: white;
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z'/%3E%3C/svg%3E");
    mask-repeat: no-repeat;
    mask-position: center;
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 10px;
  }
`;

const CategoryTab = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.primaryLight};
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
`;

const ProductCard = styled(motion.div)`
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.small};
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const ProductImage = styled.div`
  height: 180px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #999;
  position: relative;
  flex-shrink: 0;
`;

const ProductBadge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ProductInfo = styled.div`
  padding: 1rem;
`;

const ProductName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: ${props => props.theme.colors.text};
`;

const ProductPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const ProductMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.lightText};
`;

const SellerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SellerAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f0f0f0;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PostedTime = styled.span``;

const AddItemButton = styled(motion.button)`
  position: fixed;
  bottom: 5rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 10;
  
  svg {
    width: 24px;
    height: 24px;
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.accent};
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: ${props => props.theme.shadows.large};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: ${props => props.theme.colors.text}; // Explicitly set to black text
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const FormRow = styled.div`
  margin-bottom: 1.5rem;
`;

// Make FormLabel explicitly black
const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text}; // Explicitly set to black
`;

const FormGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryLight};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryLight};
  }
`;

const FileInput = styled.div`
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
  
  input {
    display: none;
  }
`;

const UploadIcon = styled.div`
  margin-bottom: 1rem;
  
  svg {
    width: 48px;
    height: 48px;
    fill: ${props => props.theme.colors.lightText};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

interface AddItemForm {
  title: string;
  price: string;
  category: string;
  condition: string;
  description: string;
  images: File[];
}

// Add trending product sample data
const trendingApparel = [
  { id: 1, title: 'Item 1', price: 98, seller: 'User 1', time: '3 days ago' },
  { id: 2, title: 'Item 2', price: 105, seller: 'User 2', time: '1 day ago' },
  { id: 3, title: 'Item 3', price: 59, seller: 'User 3', time: '2 days ago' },
  { id: 4, title: 'Item 4', price: 40, seller: 'User 4', time: '5 days ago' },
];

const trendingFurniture = [
  { id: 1, title: 'Item 1', price: 30, seller: 'User 1', time: '2 days ago' },
  { id: 2, title: 'Item 2', price: 21, seller: 'User 2', time: '1 day ago' },
  { id: 3, title: 'Item 3', price: 39, seller: 'User 3', time: '4 days ago' },
  { id: 4, title: 'Item 4', price: 8, seller: 'User 4', time: '3 days ago' },
];

// Add recommended products data
const recommendedProducts = [
  { id: 1, title: 'Item 1', price: 1200, seller: 'User 1', time: '2 days ago', match: 98 },
  { id: 2, title: 'Item 2', price: 1150, seller: 'User 2', time: '1 day ago', match: 95 },
  { id: 3, title: 'Item 3', price: 199, seller: 'User 3', time: '5 hours ago', match: 90 },
  { id: 4, title: 'Item 4', price: 120, seller: 'User 4', time: '3 days ago', match: 87 },
];

// Add styled components for the recommended section
const MatchBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #D41B2C;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  z-index: 2;
`;

// Add styled components for categories
const CategoryBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e0e0e0;
`;

const CategoryTabsRow = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #D41B2C;
    border-radius: 4px;
  }
`;

const CategoryViewAll = styled.a`
  font-size: 0.85rem;
  color: #D41B2C;
  text-decoration: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PopularCategoriesSection = styled.div`
  margin-bottom: 2rem;
`;

const PopularCategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

// Define CategoryIcon and CategoryName before CategoryCard
const CategoryIcon = styled.div`
  width: 60px;
  height: 60px;
  background-color: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 1.8rem;
  transition: all 0.3s ease;
`;

const CategoryName = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: #000000;
  transition: color 0.3s ease;
`;

// Add CategoryTooltip styled component
const CategoryTooltip = styled.div`
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${props => props.theme.colors.headerBg};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  white-space: nowrap;
  z-index: 100;
`;

// Update CategoryCard to have a more prominent hover effect and include tooltip functionality
const CategoryCard = styled(motion.div)`
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${props => props.theme.shadows.small};
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.large};
    background-color: ${props => props.theme.colors.primaryLight};
    
    ${CategoryIcon} {
      background-color: rgba(212, 27, 44, 0.1);
    }
    
    ${CategoryName} {
      color: ${props => props.theme.colors.primary};
      font-weight: 600;
    }
  }
`;

// Delete the duplicate CategoryIcon and CategoryName components that appear after CategoryCard

// Add a new array for looking for items
const lookingForItems = [
  { id: 1, title: 'Looking for: Item 1', price: 600, seller: 'User 1', time: '1 day ago' },
  { id: 2, title: 'Looking for: Item 2', price: 40, seller: 'User 2', time: '2 days ago' },
  { id: 3, title: 'Looking for: Item 3', price: 50, seller: 'User 3', time: '3 hours ago' },
];

// Add styled components for the Looking For section
const LookingForHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const PostRequestButton = styled.button`
  background-color: transparent;
  border: 1px solid #D41B2C;
  color: #D41B2C;
  font-size: 0.85rem;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  &:hover {
    background-color: #fff0f0;
  }
`;

const RequestCard = styled(motion.div)`
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #eaeaea;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const RequestTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
  color: #303030;
`;

const RequestPrice = styled.div`
  font-weight: 600;
  color: #D41B2C;
  font-size: 1rem;
`;

const ContactButton = styled(Button)`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: ${props => props.theme.colors.primary};
  padding: 0;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  
  svg {
    width: 22px;
    height: 22px;
    fill: white;
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.accent};
    transform: scale(1.05);
  }
  
  &::after {
    content: "CONTACT US";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: ${props => props.theme.colors.headerBg};
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: bold;
    white-space: nowrap;
    margin-top: 8px;
    letter-spacing: 1px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease, visibility 0.2s ease;
  }
  
  &:hover::after {
    opacity: 1;
    visibility: visible;
  }
`;

// Create a styled component for clickable section titles
const ClickableSectionTitle = styled(SectionTitle)`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  
  &:after {
    content: "→";
    font-size: 1.2rem;
    transition: transform 0.2s ease;
  }
  
  &:hover {
    &:after {
      transform: translateX(5px);
    }
    
    &:before {
      content: "Click to view all";
      position: absolute;
      right: 25px;
      top: 50%;
      transform: translateY(-50%);
      background-color: ${props => props.theme.colors.headerBg};
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
    }
  }
`;

// Function to handle section title clicks
const handleSectionClick = (section: string) => {
  console.log(`Navigating to ${section} page`);
  // In a real implementation, this would navigate to the relevant page
  // navigate(`/${section.toLowerCase().replace(/\s+/g, '-')}`);
};

// Update the menu functionality to show a dropdown with links
const MenuButton = styled.div`
  position: relative;
`;

const MenuDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  width: 220px;
  z-index: 100;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background-color: white;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: ${props => props.theme.colors.text};
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryLight};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`;

// Add styled components for notifications and contact popup
const NotificationDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  width: 320px;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  z-index: 1000; // Ensure it's above other elements
`;

const NotificationItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryLight};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const NotificationAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  overflow: hidden;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: ${props => props.theme.colors.text};
`;

const NotificationMessage = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 0.25rem;
`;

const NotificationTime = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.lightText};
`;

const NotificationEmptyMessage = styled.div`
  padding: 2rem;
  text-align: center;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const NotificationHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const NotificationFooter = styled.div`
  padding: 0.75rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  text-align: center;
`;

const SeeAllButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 1rem;
  width: 100%;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryLight};
  }
`;

// Add MessageButton styled component
const MessageButton = styled(motion.button)`
  position: fixed;
  bottom: 8rem; // Position above the MarketSwitcherButton
  right: 2rem;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 10;
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.accent};
    transform: scale(1.05);
  }
`;

// Add sample notifications data
const sampleNotifications: any[] = [];

// Add the missing ContactForm styled component
const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// Define popular categories data
const popularCategories = [
  { id: 1, name: 'Textbooks', icon: '📚' },
  { id: 2, name: 'Electronics', icon: '💻' },
  { id: 3, name: 'Furniture', icon: '🪑' },
  { id: 4, name: 'Apparel', icon: '👕' },
  { id: 5, name: 'Tickets', icon: '🎟️' },
  { id: 6, name: 'Transportation', icon: '🚲' },
  { id: 7, name: 'Free Items', icon: '🎁' },
  { id: 8, name: 'Housing', icon: '🏠' },
];

const HuskyMartPage: React.FC = () => {
  // State declarations for contact modal
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  // State declarations for notifications and profile
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMarketDropdown, setShowMarketDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [universityName, setUniversityName] = useState<string | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(() => {
    // Check if there's a stored profile picture URL in localStorage
    return localStorage.getItem('profilePictureUrl') || null;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [formData, setFormData] = useState<AddItemForm>({
    title: '',
    price: '',
    category: '',
    condition: 'New',
    description: '',
    images: []
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  // Add contact modal handlers
  const openContactModal = () => {
    setShowContactModal(true);
  };
  
  const closeContactModal = () => {
    setShowContactModal(false);
  };
  
  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleContactFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending contact form:', contactForm);
    
    // For demonstration, show an alert
    alert(`Message sent to studentunimart@gmail.com!\nWe'll get back to you soon.`);
    
    // Reset form and close modal
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setShowContactModal(false);
  };
  
  // Add notification handlers
  const handleSeeAllNotifications = () => {
    console.log('Navigating to all notifications page');
    setShowNotifications(false);
  };
  
  const handleGoToMessages = () => {
    navigate('/messages');
  };
  
  // Add navigation handlers
  const handleLogoClick = () => {
    // Navigate to HuskyMart homepage
    navigate('/huskymart');
  };

  const handleUpdateProfile = () => {
    // Set a flag in session storage to indicate we're updating an existing profile
    sessionStorage.setItem('isUpdatingProfile', 'true');
    navigate('/profile-setup');
    setShowProfileDropdown(false);
  };

  const handleSettingsClick = () => {
    // Navigate to settings page
    navigate('/settings');
    setShowProfileDropdown(false);
  };

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.clear();
    // Redirect to home
    navigate('/');
  };
  
  // Menu toggle handlers
  const toggleMarketDropdown = () => {
    setShowMarketDropdown(prev => !prev);
    // Close profile dropdown if open
    if (showProfileDropdown) setShowProfileDropdown(false);
    if (showNotifications) setShowNotifications(false);
  };
  
  const toggleProfileDropdown = () => {
    setShowProfileDropdown(prev => !prev);
    // Close market dropdown if open
    if (showMarketDropdown) setShowMarketDropdown(false);
    if (showNotifications) setShowNotifications(false);
  };
  
  const toggleMenuDropdown = () => {
    setShowMenuDropdown(prev => !prev);
    // Close other dropdowns if open
    if (showProfileDropdown) setShowProfileDropdown(false);
    if (showMarketDropdown) setShowMarketDropdown(false);
    if (showNotifications) setShowNotifications(false);
  };
  
  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
    // Close other dropdowns
    if (showProfileDropdown) setShowProfileDropdown(false);
    if (showMarketDropdown) setShowMarketDropdown(false);
    if (showMenuDropdown) setShowMenuDropdown(false);
  };
  
  // Navigation handlers
  const handleMarketChange = (path: string) => {
    navigate(path);
    setShowMarketDropdown(false);
  };
  
  const navigateToSection = (section: string) => {
    console.log(`Navigating to ${section}`);
    // In a real implementation, this would navigate to the page
    setShowMenuDropdown(false);
  };
  
  // Search handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };
  
  // Category handlers
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    // Navigate to the category-specific page
    navigate(`/huskymart/category/${category.toLowerCase().replace(/\s+/g, '-')}`);
  };
  
  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/shopping-cart');
  };

  const handleNotificationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleNotifications();
  };
  
  // Update useEffect to load the profile picture when the component mounts
  useEffect(() => {
    // Load profile data from localStorage
    const storedProfilePic = localStorage.getItem('profilePictureUrl');
    const storedFirstName = localStorage.getItem('firstName');
    const storedLastName = localStorage.getItem('lastName');
    const storedUniversityName = localStorage.getItem('universityName');
    
    if (storedProfilePic) {
      setProfilePictureUrl(storedProfilePic);
    }
    
    if (storedFirstName) {
      setFirstName(storedFirstName);
    }
    
    if (storedLastName) {
      setLastName(storedLastName);
    }
    
    if (storedUniversityName) {
      setUniversityName(storedUniversityName);
    }
  }, []);
  
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };
  
  // Inside the return statement, update the notification section
  return (
    <ThemeProvider theme={huskyTheme}>
      <Container>
        <Header>
          <LogoContainer onClick={handleLogoClick}>
            <CartIcon viewBox="0 0 24 24" onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate('/'); // Navigate to UniMart homepage
            }}>
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </CartIcon>
            <CartTooltip>Back to UniMart</CartTooltip>
            <HeaderTitle onClick={() => navigate('/huskymart')}>
              <span className="husky">Husky</span>
              <span className="mart">Mart</span>
            </HeaderTitle>
          </LogoContainer>
          
          <SearchContainer>
            <form onSubmit={handleSearchSubmit}>
              <SearchBar>
                <SearchIcon viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </SearchIcon>
                <SearchInput 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </SearchBar>
            </form>
          </SearchContainer>
          
          <HeaderActions>
            <IconButton title="Contact Us" onClick={openContactModal}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>
              </svg>
              <IconTooltip>Contact Us</IconTooltip>
            </IconButton>
            
            <IconButton title="Notifications" onClick={handleNotificationClick}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
              <IconTooltip>Notifications</IconTooltip>
            </IconButton>
            
            {showNotifications && (
              <NotificationDropdown
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ position: 'absolute', top: '100%', right: '0', zIndex: 1000 }}
              >
                <NotificationHeader>Recent Notifications</NotificationHeader>
                <NotificationEmptyMessage>
                  Damn, looks like your notis are dry.
                </NotificationEmptyMessage>
                <NotificationFooter>
                  <SeeAllButton onClick={handleSeeAllNotifications}>
                    See All Notifications
                  </SeeAllButton>
                </NotificationFooter>
              </NotificationDropdown>
            )}
            
            <MenuButton>
              <IconButton title="Menu" onClick={toggleMenuDropdown}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </svg>
                <IconTooltip>Menu</IconTooltip>
              </IconButton>
              
              {showMenuDropdown && (
                <MenuDropdown
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <MenuItem onClick={() => navigateToSection('Popular Items')}>
                    Popular Items
                  </MenuItem>
                  <MenuItem onClick={() => navigateToSection('Trending Apparel')}>
                    Trending Apparel
                  </MenuItem>
                  <MenuItem onClick={() => navigateToSection('Trending Furniture')}>
                    Trending Furniture
                  </MenuItem>
                  <MenuItem onClick={() => navigateToSection('Latest Products')}>
                    Latest Products
                  </MenuItem>
                </MenuDropdown>
              )}
            </MenuButton>
            
            <UserInfo>
              <ProfilePicture onClick={toggleProfileDropdown}>
                {profilePictureUrl ? (
                  <img src={profilePictureUrl} alt="Profile" />
                ) : (
                  <ProfileIcon viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                  </ProfileIcon>
                )}
              </ProfilePicture>
              
              {showProfileDropdown && (
                <ProfileDropdown
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProfileMenuItem onClick={handleUpdateProfile}>
                    <MenuIcon viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </MenuIcon>
                    Update Profile
                  </ProfileMenuItem>
                  <ProfileMenuItem onClick={handleSettingsClick}>
                    <MenuIcon viewBox="0 0 24 24">
                      <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5-0.38,1.03-0.7,1.62-0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
                    </MenuIcon>
                    Settings
                  </ProfileMenuItem>
                  <ProfileMenuItem onClick={handleLogout}>
                    <MenuIcon viewBox="0 0 24 24">
                      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                    </MenuIcon>
                    Sign Out
                  </ProfileMenuItem>
                </ProfileDropdown>
              )}
            </UserInfo>
          </HeaderActions>
        </Header>

        <ShoppingCartButton 
          onClick={(e) => {
            e.stopPropagation();
            navigate('/shopping-cart');
          }}
          isProfileOpen={showProfileDropdown}
        >
          <svg viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </ShoppingCartButton>

        <MainContent>
          {/* Hero Section with Campus Photo */}
          <HeroSection>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%' }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <HeroContent>
                  <HeroTitle>Northeastern Marketplace</HeroTitle>
                  <HeroSubtitle>
                    The official marketplace for Northeastern students. Buy and sell items, find tickets for events, and connect with fellow Huskies.
                  </HeroSubtitle>
                  <Button 
                    variant="primary" 
                    color="light" 
                    onClick={() => navigate('/list-item')}
                    style={{ 
                      backgroundColor: 'white', 
                      color: '#D41B2C',
                      fontWeight: 'bold',
                      border: 'none',
                      padding: '0.75rem 1.5rem'
                    }}
                  >
                    List Your Item
                  </Button>
                </HeroContent>
              </motion.div>
              <HeroImage />
            </motion.div>
          </HeroSection>
          
          <ContentLayout>
            <MainColumn>
              {/* Popular Categories */}
              <PopularCategoriesSection>
                <SectionTitle>Popular Categories</SectionTitle>
                <PopularCategoriesGrid>
                  {popularCategories.map((category, index) => (
                    <CategoryCard 
                      key={category.id} 
                      onClick={() => handleCategoryChange(category.name)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CategoryIcon>{category.icon}</CategoryIcon>
                      <CategoryName>{category.name}</CategoryName>
                    </CategoryCard>
                  ))}
                </PopularCategoriesGrid>
              </PopularCategoriesSection>

              {/* Trending Apparel Section */}
              <section>
                <ClickableSectionTitle onClick={() => handleSectionClick('Trending Apparel')}>
                  Trending Apparel
                </ClickableSectionTitle>
                <ProductsGrid>
                  {trendingApparel.map(item => (
                    <ProductCard
                      key={`apparel-${item.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: item.id * 0.05 }}
                    >
                      <ProductImage>
                        {item.id === 1 && <ProductBadge>New</ProductBadge>}
                        Product Image
                      </ProductImage>
                      <ProductInfo>
                        <ProductName>{item.title}</ProductName>
                        <ProductPrice>${item.price}</ProductPrice>
                        <ProductMeta>
                          <SellerInfo>
                            <SellerAvatar />
                            <span>{item.seller}</span>
                          </SellerInfo>
                          <PostedTime>{item.time}</PostedTime>
                        </ProductMeta>
                      </ProductInfo>
                    </ProductCard>
                  ))}
                </ProductsGrid>
              </section>

              {/* Trending Furniture Section */}
              <section style={{ marginTop: '2rem' }}>
                <ClickableSectionTitle onClick={() => handleSectionClick('Trending Furniture')}>
                  Trending Furniture
                </ClickableSectionTitle>
                <ProductsGrid>
                  {trendingFurniture.map(item => (
                    <ProductCard
                      key={`furniture-${item.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: item.id * 0.05 }}
                      onClick={() => handleProductClick(item.id)}
                    >
                      <ProductImage>
                        {item.id === 2 && <ProductBadge>New</ProductBadge>}
                        Product Image
                      </ProductImage>
                      <ProductInfo>
                        <ProductName>{item.title}</ProductName>
                        <ProductPrice>${item.price}</ProductPrice>
                        <ProductMeta>
                          <SellerInfo>
                            <SellerAvatar />
                            <span>{item.seller}</span>
                          </SellerInfo>
                          <PostedTime>{item.time}</PostedTime>
                        </ProductMeta>
                      </ProductInfo>
                    </ProductCard>
                  ))}
                </ProductsGrid>
              </section>
            </MainColumn>
            
            <SideColumn>
              {/* Looking For Section */}
              <section style={{ marginBottom: '2rem' }}>
                <LookingForHeader>
                  <ClickableSectionTitle onClick={() => handleSectionClick('Looking For')}>
                    Looking For
                  </ClickableSectionTitle>
                  <PostRequestButton>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                    Post Request
                  </PostRequestButton>
                </LookingForHeader>
                
                {lookingForItems.map(item => (
                  <RequestCard
                    key={`request-${item.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: item.id * 0.05 }}
                  >
                    <RequestTitle>{item.title}</RequestTitle>
                    <RequestPrice>Up to ${item.price}</RequestPrice>
                    <ProductMeta>
                      <SellerInfo>
                        <SellerAvatar />
                        <span>{item.seller}</span>
                      </SellerInfo>
                      <PostedTime>{item.time}</PostedTime>
                    </ProductMeta>
                  </RequestCard>
                ))}
              </section>

              {/* Latest Products Section */}
              <section>
                <ClickableSectionTitle onClick={() => handleSectionClick('Latest Products')}>
                  Latest Products
                </ClickableSectionTitle>
                <ProductsGrid>
                  {[1, 2, 3].map(item => (
                    <ProductCard
                      key={`latest-${item}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: item * 0.05 }}
                    >
                      <ProductImage>
                        <ProductBadge>New</ProductBadge>
                        Product Image
                      </ProductImage>
                      <ProductInfo>
                        <ProductName>Item {item}</ProductName>
                        <ProductPrice>${(Math.random() * 100).toFixed(2)}</ProductPrice>
                        <ProductMeta>
                          <SellerInfo>
                            <SellerAvatar />
                            <span>User {item}</span>
                          </SellerInfo>
                          <PostedTime>Just now</PostedTime>
                        </ProductMeta>
                      </ProductInfo>
                    </ProductCard>
                  ))}
                </ProductsGrid>
              </section>
            </SideColumn>
          </ContentLayout>
        </MainContent>
        
        {/* Messages Button */}
        <MessageButton
          onClick={handleGoToMessages}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        </MessageButton>
        
        <MarketSwitcherContainer>
          <MarketSwitcherButton
            onClick={toggleMarketDropdown}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Change Marketplace</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10l5 5 5-5H7z" fill="currentColor" />
            </svg>
          </MarketSwitcherButton>
          
          {showMarketDropdown && (
            <MarketDropdown
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <MarketOption 
                key="HuskyMart"
                onClick={() => handleMarketChange('/huskymart')}
              >
                <MarketIcon bgColor="#D41B2C" />
                HuskyMart
              </MarketOption>
            </MarketDropdown>
          )}
        </MarketSwitcherContainer>
        
        <Footer>
          <FooterText>
            UniMart is currently operated as a sole proprietorship. All transactions are subject to our{' '}
            <a href="/user-agreement" onClick={(e) => {
              e.preventDefault();
              navigate('/user-agreement');
            }}>User Agreement</a>
            {' '}and{' '}
            <a href="/privacy" onClick={(e) => {
              e.preventDefault();
              navigate('/privacy');
            }}>Privacy Notice</a>
            .
          </FooterText>
        </Footer>
        
        {/* Modals */}
        {showContactModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeContactModal}
          >
            <ModalContent
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              onClick={e => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>Contact Us</ModalTitle>
                <CloseButton onClick={closeContactModal}>&times;</CloseButton>
              </ModalHeader>
              
              <ContactForm onSubmit={handleContactFormSubmit}>
                <FormRow>
                  <FormLabel htmlFor="name">Your Name</FormLabel>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={contactForm.name}
                    onChange={handleContactFormChange}
                    required
                  />
                </FormRow>
                
                <FormRow>
                  <FormLabel htmlFor="email">Your Email</FormLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={contactForm.email}
                    onChange={handleContactFormChange}
                    required
                  />
                </FormRow>
                
                <FormRow>
                  <FormLabel htmlFor="subject">Subject</FormLabel>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What is this regarding?"
                    value={contactForm.subject}
                    onChange={handleContactFormChange}
                    required
                  />
                </FormRow>
                
                <FormRow>
                  <FormLabel htmlFor="message">Message</FormLabel>
                  <TextArea
                    id="message"
                    name="message"
                    placeholder="How can we help you?"
                    value={contactForm.message}
                    onChange={handleContactFormChange}
                    required
                  />
                </FormRow>
                
                <ButtonGroup>
                  <Button
                    variant="outline"
                    onClick={closeContactModal}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Send Message
                  </Button>
                </ButtonGroup>
                
                <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                  Your message will be sent to studentunimart@gmail.com
                </div>
              </ContactForm>
            </ModalContent>
          </ModalOverlay>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default HuskyMartPage;