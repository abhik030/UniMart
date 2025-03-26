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
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: white;
  
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

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  
  // Empty contacts array instead of mock data
  const [contacts, setContacts] = useState<Contact[]>([]);
  
  // Empty messages array instead of mock data
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Scroll to bottom of messages when messages change or contact is selected
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedContact]);
  
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
  
  const handleSendMessage = () => {
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
  
  return (
    <ThemeProvider theme={huskyTheme}>
      <Container>
        <Header>
          <LogoContainer>
            <CartIcon viewBox="0 0 24 24" onClick={handleCartClick}>
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </CartIcon>
            <CartTooltip>UniMart Home</CartTooltip>
            <HeaderTitle><span className="husky">Husky</span><span className="mart">Mart</span></HeaderTitle>
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
            
            <IconButton title="Menu">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
              <IconTooltip>Menu</IconTooltip>
            </IconButton>
          </HeaderActions>
        </Header>
        
        <MainContent>
          <ContactsList>
            <ContactsHeader>
              <ContactsTitle>Messages</ContactsTitle>
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
                <EmptyStateText>No messages yet</EmptyStateText>
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
                <MessageInput
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={handleMessageInputChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <SendButton onClick={handleSendMessage}>Send</SendButton>
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
      </Container>
    </ThemeProvider>
  );
};

export default MessagesPage;
