import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { motion } from 'framer-motion';

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

// Sample cart items data with updated structure
const sampleCartItems = [
  {
    id: 1,
    title: 'Northeastern Hoodie',
    price: 45,
    seller: 'John Doe',
    image: '/hoodie.jpg',
    condition: 'Like New',
    checked: true
  },
  {
    id: 2,
    title: 'Calculus Textbook',
    price: 30,
    seller: 'Jane Smith',
    image: '/textbook.jpg',
    condition: 'Good',
    checked: true
  },
  {
    id: 3,
    title: 'Desk Chair',
    price: 25,
    seller: 'Mike Johnson',
    image: '/chair.jpg',
    condition: 'Excellent',
    checked: true
  },
  {
    id: 4,
    title: 'Physics Textbook',
    price: 35,
    seller: 'Jane Smith',
    image: '/physics.jpg',
    condition: 'Good',
    checked: true
  }
];

// Global Header Components
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${props => props.theme.colors.headerBg};
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
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
  width: 700px;
  max-width: 50%;
`;

const SearchBar = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  border: none;
  background-color: white;
  color: ${props => props.theme.colors.text};
  font-size: 1.1rem;
  
  &::placeholder {
    color: #999;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
  position: relative;
`;

const IconTooltipStyles = styled.div`
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
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  position: relative;
  
  &:hover {
    background-color: rgba(212, 27, 44, 0.1);
    
    & + ${IconTooltipStyles} {
      opacity: 1;
    }
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const IconTooltip = IconTooltipStyles;

// Notification dropdown component
const NotificationDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  width: 320px;
  background-color: white;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.large};
  z-index: 1000;
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

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const CartContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: #000;
  margin: 0 0 1.5rem 0;
`;

const SellerSection = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const SellerHeader = styled.div`
  padding: 1rem 1.5rem;
  background-color: #f2f2f2;
  border-bottom: 1px solid #eee;
  font-weight: 600;
  display: flex;
  align-items: center;
`;

const SelectAllCheckbox = styled.input`
  margin-right: 1rem;
  width: 18px;
  height: 18px;
  cursor: pointer;
  
  &:checked {
    accent-color: ${props => props.theme.colors.primary};
  }
`;

const CartItem = styled(motion.div)`
  display: flex;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  align-items: center;
  gap: 1.5rem;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemCheckbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  
  &:checked {
    accent-color: ${props => props.theme.colors.primary};
  }
`;

const ItemImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 8px;
  background-color: #f0f0f0;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  color: #000;
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const ItemMeta = styled.div`
  display: flex;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const ItemPrice = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #D41B2C;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f0f0f0;
    color: #D41B2C;
  }
`;

const CartSummary = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #666;
  
  &:last-child {
    margin-bottom: 0;
    font-weight: 600;
    color: #000;
    font-size: 1.1rem;
  }
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #D41B2C;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #b31528;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const EmptyCartIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyCartText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
`;

const ContinueShoppingButton = styled.button`
  background-color: #D41B2C;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #b31528;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

interface CartItem {
  id: number;
  title: string;
  price: number;
  seller: string;
  image: string;
  condition: string;
  checked: boolean;
}

const ShoppingCartPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>(sampleCartItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const toggleItemCheck = (id: number) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const toggleSellerItems = (seller: string, checked: boolean) => {
    setCartItems(items => 
      items.map(item => 
        item.seller === seller ? { ...item, checked: checked } : item
      )
    );
  };

  const isSellerChecked = (seller: string) => {
    const sellerItems = cartItems.filter(item => item.seller === seller);
    return sellerItems.every(item => item.checked);
  };

  const calculateTotal = () => {
    return cartItems
      .filter(item => item.checked)
      .reduce((total, item) => total + item.price, 0);
  };

  const calculateTransactionFee = () => {
    return calculateTotal() * 0.03;
  };

  const calculateEstimatedTax = () => {
    return calculateTotal() * 0.0625;
  };

  const calculateFinalTotal = () => {
    return calculateTotal() + calculateEstimatedTax() + calculateTransactionFee();
  };

  // Group items by seller
  const itemsBySeller = cartItems.reduce((acc, item) => {
    if (!acc[item.seller]) {
      acc[item.seller] = [];
    }
    acc[item.seller].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  const handleItemClick = (id: number) => {
    navigate(`/product/${id}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
  };

  const handleLogoClick = () => {
    navigate('/huskymart');
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/');
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleNotificationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleNotifications();
  };

  const handleMessagesClick = () => {
    navigate('/messages');
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
            <CartTooltip>Back to UniMart</CartTooltip>
            <HeaderTitle onClick={handleLogoClick}>
              <span className="husky">Husky</span>
              <span className="mart">Mart</span>
            </HeaderTitle>
          </LogoContainer>
          
          <SearchContainer>
            <form onSubmit={handleSearchSubmit}>
              <SearchBar>
                <SearchInput 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </SearchBar>
            </form>
          </SearchContainer>
          
          <HeaderActions>
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
            
            <IconButton title="Messages" onClick={handleMessagesClick}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
              </svg>
              <IconTooltip>Messages</IconTooltip>
            </IconButton>
          </HeaderActions>
        </Header>

        <CartContainer>
          <BackButton onClick={() => {
            if (location.state?.fromCheckout) {
              navigate('/huskymart'); // Navigate to HuskyMart if coming from checkout
            } else {
              navigate(-1); // Otherwise, go back to the previous page
            }
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back
          </BackButton>
          
          <PageTitle>Shopping Cart</PageTitle>

          {cartItems.length > 0 ? (
            <>
              {Object.entries(itemsBySeller).map(([seller, items]) => (
                <SellerSection key={seller}>
                  <SellerHeader>
                    <SelectAllCheckbox 
                      type="checkbox" 
                      checked={isSellerChecked(seller)}
                      onChange={(e) => toggleSellerItems(seller, e.target.checked)}
                    />
                    Seller: {seller}
                  </SellerHeader>
                  
                  {items.map(item => (
                    <CartItem
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <ItemCheckbox 
                        type="checkbox" 
                        checked={item.checked}
                        onChange={() => toggleItemCheck(item.id)}
                      />
                      <ItemImage>
                        <img src={item.image} alt={item.title} />
                      </ItemImage>
                      <ItemDetails>
                        <ItemTitle onClick={() => handleItemClick(item.id)}>{item.title}</ItemTitle>
                        <ItemMeta>
                          <span>Condition: {item.condition}</span>
                        </ItemMeta>
                        <ItemPrice>${item.price}</ItemPrice>
                      </ItemDetails>
                      <RemoveButton onClick={() => removeItem(item.id)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                      </RemoveButton>
                    </CartItem>
                  ))}
                </SellerSection>
              ))}
              
              <CartSummary>
                <SummaryRow>
                  <span>Subtotal ({cartItems.filter(item => item.checked).length} items)</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Transaction Fee (3%)</span>
                  <span>${calculateTransactionFee().toFixed(2)}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Estimated Tax</span>
                  <span>${calculateEstimatedTax().toFixed(2)}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Total</span>
                  <span>${calculateFinalTotal().toFixed(2)}</span>
                </SummaryRow>
                <CheckoutButton 
                  disabled={calculateTotal() === 0}
                  onClick={() => navigate('/checkout')}
                >
                  {calculateTotal() === 0 ? 'Select items to checkout' : 'Proceed to Checkout'}
                </CheckoutButton>
              </CartSummary>
            </>
          ) : (
            <EmptyCart>
              <EmptyCartIcon>🛒</EmptyCartIcon>
              <EmptyCartText>Your shopping cart is empty</EmptyCartText>
              <ContinueShoppingButton onClick={() => navigate('/huskymart')}>
                Continue Shopping
              </ContinueShoppingButton>
            </EmptyCart>
          )}
        </CartContainer>
      </Container>
    </ThemeProvider>
  );
};

export default ShoppingCartPage; 