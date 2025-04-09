import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Input from '../components/Input';

// Message interface
interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  read: boolean;
  isOwn: boolean;
}

// Contact interface
interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

// Northeastern University colors - matching the existing theme
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
  font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: 0.01em;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2rem;
  background-color: ${props => props.theme.colors.headerBg};
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  top: 100%;
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
  flex-grow: 1;
  margin: 0 2rem;
  max-width: 500px;
`;

const SearchBar = styled.div`
  position: relative;
  width: 100%;
`;

const HeaderSearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border-radius: 20px;
  border: none;
  background-color: white;
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  
  &::placeholder {
    color: #999;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.teal};
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
`;

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

const MainContent = styled.div`
  display: flex;
  flex: 1;
  background-color: #f5f5f5;
`;

const ContactsList = styled.div`
  width: 300px;
  background-color: white;
  border-right: 1px solid ${props => props.theme.colors.border};
  overflow-y: auto;
`;

const ContactsHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ContactsTitle = styled.h2`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.large};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  margin: 0.5rem 0;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: ${props => props.theme.fontSizes.medium};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ContactItem = styled.div<{ active?: boolean }>`
  padding: 1rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  background-color: ${props => props.active ? props.theme.colors.primaryLight : 'transparent'};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primaryLight : '#f5f5f5'};
  }
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ContactInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ContactName = styled.h3`
  margin: 0 0 0.25rem;
  font-size: ${props => props.theme.fontSizes.medium};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const LastMessage = styled.p`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.colors.lightText};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ContactMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 0.5rem;
`;

const LastMessageTime = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 0.25rem;
`;

const UnreadBadge = styled.div`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  font-size: 0.75rem;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ChatHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background-color: white;
  display: flex;
  align-items: center;
`;

const ChatHeaderInfo = styled.div`
  margin-left: 1rem;
`;

const ChatHeaderName = styled.h2`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.large};
  font-weight: 600;
`;

const OnlineStatus = styled.p`
  margin: 0.25rem 0 0;
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.colors.success};
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 150px); /* Adjust based on header + input heights */
`;

const MessageGroup = styled.div<{ isOwn: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  margin-bottom: 1rem;
  max-width: 75%;
  align-self: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div<{ isOwn: boolean }>`
  padding: 0.75rem 1rem;
  background-color: ${props => props.isOwn ? props.theme.colors.primary : 'white'};
  color: ${props => props.isOwn ? 'white' : props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.small};
  margin-bottom: 0.25rem;
  word-wrap: break-word;
`;

const MessageTime = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.lightText};
`;

const ChatInputContainer = styled.div`
  padding: 1rem;
  background-color: white;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  position: sticky;
  bottom: 0;
  width: 100%;
  z-index: 10;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: ${props => props.theme.fontSizes.medium};
  margin-right: 0.5rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SendButton = styled(Button)`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: ${props => props.theme.fontSizes.medium};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.accent};
  }
`;

const EmptyStateContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.lightText};
  padding: 2rem;
  text-align: center;
  transition: all 0.2s ease;
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.border};
`;

const EmptyStateText = styled.p`
  font-size: ${props => props.theme.fontSizes.large};
  margin: 0 0 1rem;
  color: ${props => props.theme.colors.text};
  font-weight: 400;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  line-height: 1.5;
  letter-spacing: 0.015em;
`;

const NotificationDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  width: 320px;
  background-color: white;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.large};
  z-index: 100;
  overflow: hidden;
  margin-top: 8px;
`;

const NotificationHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const NotificationEmptyMessage = styled.div`
  padding: 24px 16px;
  text-align: center;
  color: ${props => props.theme.colors.lightText};
  font-size: ${props => props.theme.fontSizes.medium};
`;

const NotificationFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
  text-align: center;
`;

const SeeAllButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const DeleteIcon = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  fill: ${props => props.theme.colors.lightText};
  opacity: 0;
  transition: opacity 0.2s ease, color 0.2s ease;
  cursor: pointer;
  
  &:hover {
    fill: ${props => props.theme.colors.error};
  }
`;

const NotificationItem = styled.div`
  position: relative;
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:hover ${DeleteIcon} {
    opacity: 1;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
`;

const ProfilePicture = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid white;
  cursor: pointer;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return formatTime(date);
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

// Add this array of empty state messages
const emptyStateMessages = [
  "No luck with the huzz?",
  "You swung... And ya missed...",
  "Coming up empty handed again?",
  "Put the fries in the bag bro shes not coming back.",
  "No sauce in the pasta",
  "I guess your gooning with the squad tonight."
];

// Add this after the EmptyStateText component
const AddContactButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

// Add modal components for the add contact feature
const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  width: 90%;
  max-width: 500px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.large};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.lightText};
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const ModalBody = styled.div`
  padding: 1rem;
`;

const SearchInputContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const SearchResults = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const ContactResultItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryLight};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`;

const ResultInfo = styled.div`
  flex: 1;
  margin-left: 0.75rem;
`;

const ResultName = styled.h4`
  margin: 0 0 0.25rem;
  font-size: ${props => props.theme.fontSizes.medium};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const ContactDetails = styled.p`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.colors.lightText};
`;

const AddButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.small};
  padding: 0.5rem 1rem;
  font-size: ${props => props.theme.fontSizes.small};
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.accent};
  }
`;

const NoResultsMessage = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.lightText};
  padding: 1rem;
`;

// Add these interface definitions
interface ContactSearchResult {
  id: string;
  name: string;
  university: string;
  email: string;
  avatar: string;
}

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(() => {
    // Check if there's a stored profile picture URL in localStorage
    return localStorage.getItem('profilePictureUrl') || null;
  });
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [universityName, setUniversityName] = useState<string | null>(null);
  
  // Add state for the empty message index but don't need onClick handler anymore
  const [emptyMessageIndex, setEmptyMessageIndex] = useState(0);
  
  // Empty contacts array instead of mock data
  const [contacts, setContacts] = useState<Contact[]>([]);
  
  // Empty messages array instead of mock data
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Add state for the add contact feature
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [contactSearchResults, setContactSearchResults] = useState<ContactSearchResult[]>([]);
  const [contactSearchLoading, setContactSearchLoading] = useState(false);
  
  // Add state for menu dropdown
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  
  // Scroll to bottom of messages when messages change or contact is selected
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedContact]);
  
  // Load profile data from localStorage
  useEffect(() => {
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
  
  const handleCartClick = () => {
    navigate('/');
  };
  
  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    
    // Mark messages from this contact as read
    setContacts(prevContacts => 
      prevContacts.map(c => 
        c.id === contact.id ? { ...c, unreadCount: 0 } : c
      )
    );
    
    setMessages(prevMessages => 
      prevMessages.map(m => 
        m.sender === contact.id && !m.read ? { ...m, read: true } : m
      )
    );
  };
  
  const handleMessageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };
  
  const handleSendMessage = (e?: React.FormEvent) => {
    // If event is provided, prevent default
    if (e) {
      e.preventDefault();
    }
    
    if (!messageInput.trim() || !selectedContact) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'me',
      content: messageInput,
      timestamp: new Date(),
      read: true,
      isOwn: true
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    // Update the last message in the contact list
    setContacts(prevContacts => 
      prevContacts.map(c => 
        c.id === selectedContact.id 
          ? { ...c, lastMessage: messageInput, lastMessageTime: new Date() }
          : c
      )
    );
    
    setMessageInput('');
    
    // Simulate a reply after 2 seconds
    setTimeout(() => {
      if (selectedContact) {
        const replyMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: selectedContact.id,
          content: 'Thanks for your message! I\'ll get back to you soon.',
          timestamp: new Date(),
          read: true,
          isOwn: false
        };
        
        setMessages(prevMessages => [...prevMessages, replyMessage]);
        
        // Update the last message in the contact list
        setContacts(prevContacts => 
          prevContacts.map(c => 
            c.id === selectedContact.id 
              ? { 
                  ...c, 
                  lastMessage: 'Thanks for your message! I\'ll get back to you soon.', 
                  lastMessageTime: new Date() 
                }
              : c
          )
        );
      }
    }, 2000);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleHeaderSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeaderSearchQuery(e.target.value);
  };
  
  const handleHeaderSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', headerSearchQuery);
  };
  
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredMessages = selectedContact 
    ? messages.filter(message => 
        message.sender === selectedContact.id || message.sender === 'me'
      )
    : [];
  
  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
  };
  
  const handleSeeAllNotifications = () => {
    console.log('Navigating to all notifications page');
    setShowNotifications(false);
  };
  
  // Profile dropdown handlers
  const toggleProfileDropdown = () => {
    setShowProfileDropdown(prev => !prev);
    // Close notifications if open
    if (showNotifications) setShowNotifications(false);
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
  
  // Add useEffect to randomize the empty message on page load/refresh
  useEffect(() => {
    // Get a random index for the empty message
    const randomIndex = Math.floor(Math.random() * emptyStateMessages.length);
    setEmptyMessageIndex(randomIndex);
  }, []); // Empty dependency array ensures this runs only on mount
  
  // Add functions for the add contact feature
  const handleOpenAddContactModal = () => {
    setShowAddContactModal(true);
    // Reset the search
    setContactSearchQuery('');
    setContactSearchResults([]);
  };
  
  const handleCloseAddContactModal = () => {
    setShowAddContactModal(false);
  };
  
  const handleContactSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactSearchQuery(e.target.value);
    
    // Only search if there's at least 2 characters
    if (e.target.value.length >= 2) {
      searchContacts(e.target.value);
    } else {
      setContactSearchResults([]);
    }
  };
  
  const searchContacts = (query: string) => {
    setContactSearchLoading(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      // Remove mock data results and show a message about future functionality
      setContactSearchResults([]);
      setContactSearchLoading(false);
    }, 500);
  };
  
  const handleAddContact = (contact: ContactSearchResult) => {
    // Create a new contact
    const newContact: Contact = {
      id: contact.id,
      name: contact.name,
      avatar: contact.avatar,
      lastMessage: '',
      lastMessageTime: new Date(),
      unreadCount: 0
    };
    
    // Add to contacts list
    setContacts(prevContacts => [...prevContacts, newContact]);
    
    // Close modal
    handleCloseAddContactModal();
    
    // Show success message
    alert(`Contact ${contact.name} added successfully!`);
  };
  
  // Add toggleMenuDropdown function
  const toggleMenuDropdown = () => {
    setShowMenuDropdown(prev => !prev);
    // Close other dropdowns
    if (showNotifications) setShowNotifications(false);
    if (showProfileDropdown) setShowProfileDropdown(false);
  };
  
  return (
    <ThemeProvider theme={huskyTheme}>
      <Container>
        <Header>
          <LogoContainer>
            <CartIcon viewBox="0 0 24 24" onClick={handleCartClick}>
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </CartIcon>
            <CartTooltip>UniMart Home</CartTooltip>
            <HeaderTitle onClick={() => navigate('/huskymart')}>
              <span className="husky">Husky</span>
              <span className="mart">Mart</span>
            </HeaderTitle>
          </LogoContainer>
          
          <SearchContainer>
            <form onSubmit={handleHeaderSearchSubmit}>
              <SearchBar>
                <SearchIcon viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </SearchIcon>
                <HeaderSearchInput 
                  type="text" 
                  placeholder="Search products..." 
                  value={headerSearchQuery}
                  onChange={handleHeaderSearchChange}
                />
              </SearchBar>
            </form>
          </SearchContainer>
          
          <HeaderActions>
            <IconButton title="Contact Us">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>
              </svg>
              <IconTooltip>Contact Us</IconTooltip>
            </IconButton>
            
            <IconButton title="Notifications" onClick={toggleNotifications}>
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
              >
                <NotificationHeader>Recent Notifications</NotificationHeader>
                <NotificationEmptyMessage>
                  Damn looks like your notis are dry
                </NotificationEmptyMessage>
                <NotificationFooter>
                  <SeeAllButton onClick={handleSeeAllNotifications}>
                    See All Notifications
                  </SeeAllButton>
                </NotificationFooter>
              </NotificationDropdown>
            )}
            
            <IconButton title="Menu" onClick={toggleMenuDropdown}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
              <IconTooltip>Menu</IconTooltip>
            </IconButton>
            
            {showMenuDropdown && (
              <ProfileDropdown
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ProfileMenuItem onClick={() => { navigate('/huskymart'); toggleMenuDropdown(); }}>
                  <MenuIcon viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </MenuIcon>
                  Home
                </ProfileMenuItem>
                <ProfileMenuItem onClick={() => { navigate('/shopping-cart'); toggleMenuDropdown(); }}>
                  <MenuIcon viewBox="0 0 24 24">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                  </MenuIcon>
                  Shopping Cart
                </ProfileMenuItem>
              </ProfileDropdown>
            )}
            
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
        
        <MainContent>
          <ContactsList>
            <ContactsHeader>
              <ContactsTitle>Messages</ContactsTitle>
              <AddContactButton onClick={handleOpenAddContactModal}>+</AddContactButton>
            </ContactsHeader>
            <SearchInput 
              placeholder="Search contacts..." 
              value={searchQuery}
              onChange={handleSearchChange}
            />
            
            {filteredContacts.length > 0 ? (
              filteredContacts.map(contact => (
                <ContactItem 
                  key={contact.id}
                  active={selectedContact?.id === contact.id}
                  onClick={() => handleContactSelect(contact)}
                >
                  <Avatar>
                    <img src={contact.avatar} alt={contact.name} />
                  </Avatar>
                  <ContactInfo>
                    <ContactName>{contact.name}</ContactName>
                    <LastMessage>{contact.lastMessage}</LastMessage>
                  </ContactInfo>
                  <ContactMeta>
                    <LastMessageTime>{formatDate(contact.lastMessageTime)}</LastMessageTime>
                    {contact.unreadCount > 0 && (
                      <UnreadBadge>{contact.unreadCount}</UnreadBadge>
                    )}
                  </ContactMeta>
                </ContactItem>
              ))
            ) : (
              <EmptyStateContainer>
                <EmptyStateText>{emptyStateMessages[emptyMessageIndex]}</EmptyStateText>
              </EmptyStateContainer>
            )}
          </ContactsList>
          
          {selectedContact ? (
            <ChatContainer>
              <ChatHeader>
                <Avatar>
                  <img src={selectedContact.avatar} alt={selectedContact.name} />
                </Avatar>
                <ChatHeaderInfo>
                  <ChatHeaderName>{selectedContact.name}</ChatHeaderName>
                  <OnlineStatus>Online</OnlineStatus>
                </ChatHeaderInfo>
              </ChatHeader>
              
              <MessagesContainer>
                {filteredMessages.map((message, index) => (
                  <MessageGroup key={message.id} isOwn={message.isOwn}>
                    <MessageBubble isOwn={message.isOwn}>{message.content}</MessageBubble>
                    <MessageTime>{formatTime(message.timestamp)}</MessageTime>
                  </MessageGroup>
                ))}
                <div ref={messagesEndRef} />
              </MessagesContainer>
              
              <ChatInputContainer>
                <form onSubmit={handleSendMessage} style={{ display: 'flex', width: '100%' }}>
                  <MessageInput
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={handleMessageInputChange}
                  />
                  <SendButton type="submit">Send</SendButton>
                </form>
              </ChatInputContainer>
            </ChatContainer>
          ) : (
            <EmptyStateContainer>
              <EmptyStateIcon>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/>
                </svg>
              </EmptyStateIcon>
              <EmptyStateText>Select a conversation to start messaging</EmptyStateText>
            </EmptyStateContainer>
          )}
        </MainContent>
        
        {/* Add contact modal */}
        {showAddContactModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <ModalHeader>
                <ModalTitle>Add Contact</ModalTitle>
                <CloseButton onClick={handleCloseAddContactModal}>&times;</CloseButton>
              </ModalHeader>
              <ModalBody>
                <SearchInputContainer>
                  <SearchInput 
                    placeholder="Search by name or email..."
                    value={contactSearchQuery}
                    onChange={handleContactSearchChange}
                  />
                  {contactSearchLoading && (
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                      Searching...
                    </div>
                  )}
                </SearchInputContainer>
                
                <SearchResults>
                  {contactSearchResults.length > 0 ? (
                    contactSearchResults.map(result => (
                      <ContactResultItem key={result.id}>
                        <Avatar>
                          <img src={result.avatar} alt={result.name} />
                        </Avatar>
                        <ResultInfo>
                          <ResultName>{result.name}</ResultName>
                          <ContactDetails>{result.email}</ContactDetails>
                          <ContactDetails>{result.university}</ContactDetails>
                        </ResultInfo>
                        <AddButton onClick={() => handleAddContact(result)}>
                          Add
                        </AddButton>
                      </ContactResultItem>
                    ))
                  ) : contactSearchQuery.length >= 2 ? (
                    <NoResultsMessage>This will search for real students at your university in the future. No data is being stored or searched at this time.</NoResultsMessage>
                  ) : (
                    <NoResultsMessage>Enter at least 2 characters to search</NoResultsMessage>
                  )}
                </SearchResults>
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default MessagesPage;
