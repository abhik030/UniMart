import React, { useState, useEffect, useRef } from 'react';
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
    body: "'Poppins', sans-serif",
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

// Header Components (reused from ShoppingCartPage)
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

// Main Container and Page Styling
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const CheckoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: ${props => props.theme.colors.text};
  
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2rem;
  }
`;

const MainContent = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (min-width: 768px) {
    padding-right: 2rem;
  }
`;

const SidePanel = styled.div`
  flex: 1;
  margin-top: 2rem;
  
  @media (min-width: 768px) {
    margin-top: 0;
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.text};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  color: ${props => props.theme.colors.lightText};
  cursor: pointer;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

// Payment Method Section
const Section = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.small};
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};
`;

const PaymentMethodsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PaymentMethodOption = styled.label`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.body};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primaryLight};
  }
`;

const PaymentLogo = styled.div`
  width: 60px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const PaymentRadio = styled.input`
  margin-right: 0.5rem;
  accent-color: ${props => props.theme.colors.primary};
  width: 18px;
  height: 18px;
`;

const PaymentLabel = styled.span`
  font-size: 1rem;
  font-weight: 500;
  flex-grow: 1;
  color: ${props => props.theme.colors.text};
`;

const SpecialFinancing = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.lightText};
  margin-top: 0.5rem;
`;

const SeeTerms = styled.a`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  margin-left: 0.25rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

// Order Summary Section
const OrderSummarySection = styled(Section)`
  position: sticky;
  top: 13rem;
  color: ${props => props.theme.colors.text};
`;

const SummaryItem = styled.div<{ isLast?: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: ${props => props.isLast ? 'none' : `1px solid ${props.theme.colors.border}`};
  color: ${props => props.theme.colors.text};
  
  &:last-child {
    font-weight: 700;
    font-size: 1.1rem;
    margin-top: 0.5rem;
    padding-top: 1rem;
    border-top: 2px solid ${props => props.theme.colors.border};
  }
`;

const ItemCountLabel = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  margin-left: 0.25rem;
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 1.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #b01625;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

// Order Items Section
const OrderItemsSection = styled(Section)`
  margin-bottom: 2rem;
`;

const OrderItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.div`
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: ${props => props.theme.borderRadius.small};
  }
`;

const ItemDetails = styled.div`
  flex-grow: 1;
`;

const ItemTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const ItemPrice = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  color: ${props => props.theme.colors.primary};
`;

const ItemSeller = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 0.5rem;
`;

// Donation Section
const DonationSection = styled(Section)`
  margin-bottom: 2rem;
`;

const DonationOption = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.theme.colors.text};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primaryLight};
  }
`;

const DonationInfo = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
  line-height: 1.4;
`;

// Legal Section
const LegalSection = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.lightText};
  margin-top: 2rem;
  line-height: 1.5;
  text-align: center;
`;

const LegalLink = styled.a`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

// Info icon and tooltip for credit card information
const InfoIcon = styled.button`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.lightText};
  color: white;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  margin-left: 6px;
  cursor: pointer;
  position: relative;
  
  &:hover + div {
    visibility: visible;
    opacity: 1;
  }
`;

const InfoTooltip = styled.div`
  position: absolute;
  width: 250px;
  background-color: ${props => props.theme.colors.text};
  color: white;
  padding: 10px;
  border-radius: ${props => props.theme.borderRadius.small};
  box-shadow: ${props => props.theme.shadows.medium};
  z-index: 100;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  line-height: 1.4;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s ease, visibility 0.2s ease;
  
  &:before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid ${props => props.theme.colors.text};
  }
`;

const CashWarning = styled.div`
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.lightText};
  font-style: italic;
`;

const DiscountBadge = styled.span`
  display: inline-block;
  background-color: ${props => props.theme.colors.success};
  color: white;
  padding: 2px 5px;
  font-size: 0.75rem;
  border-radius: ${props => props.theme.borderRadius.small};
  margin-left: 6px;
`;

const InfoIconContainer = styled.div`
  display: inline-block;
  position: relative;
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

// Mock data for demonstration
const sampleCartItems: CartItem[] = [
  {
    id: 1,
    title: 'Northeastern Hoodie',
    price: 45,
    seller: 'John Doe',
    image: 'https://placehold.co/200x200?text=Hoodie',
    condition: 'Like New',
    checked: true
  },
  {
    id: 2,
    title: 'Calculus Textbook',
    price: 30,
    seller: 'Jane Smith',
    image: 'https://placehold.co/200x200?text=Textbook',
    condition: 'Good',
    checked: true
  }
];

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState<string>('stripe');
  const [roundUpDonation, setRoundUpDonation] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCreditCardInfo, setShowCreditCardInfo] = useState(false);
  const creditCardInfoRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // This would be replaced with an API call to get selected items
    const selectedItems = sampleCartItems.filter(item => item.checked);
    setCartItems(selectedItems);
  }, []);
  
  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };
  
  // Calculate tax (estimated at 6.25%)
  const calculateTax = () => {
    return Math.round(calculateSubtotal() * 0.0625 * 100) / 100;
  };
  
  // Calculate donation amount (round up to nearest dollar)
  const calculateDonation = () => {
    if (!roundUpDonation) return 0;
    
    const transactionFee = calculateTransactionFee();
    const total = calculateSubtotal() + calculateTax() - calculateDiscount() + transactionFee;
    const roundedTotal = Math.ceil(total);
    return Math.max(0, roundedTotal - total); // Ensure donation is never negative
  };
  
  // Calculate transaction fee (3% for all purchases)
  const calculateTransactionFee = () => {
    return Math.round(calculateSubtotal() * 0.03 * 100) / 100;
  };
  
  // Calculate discount (2% for non-cash payments)
  const calculateDiscount = () => {
    if (paymentMethod !== 'cash') {
      return Math.round(calculateSubtotal() * 0.02 * 100) / 100;
    }
    return 0;
  };
  
  // Calculate total with all fees and discounts
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const discount = calculateDiscount();
    const transactionFee = calculateTransactionFee();
    const donation = calculateDonation();
    
    return subtotal + tax - discount + transactionFee + donation;
  };
  
  const handleLogoClick = () => {
    navigate('/huskymart');
  };
  
  const handleBackClick = () => {
    navigate('/cart');
  };
  
  const getPaymentButtonText = () => {
    switch(paymentMethod) {
      case 'stripe':
        return 'Pay with Stripe';
      case 'cash':
        return 'Pay with Cash';
      case 'venmo':
        return 'Pay with Venmo';
      case 'apple':
        return 'Pay with Apple Pay';
      default:
        return 'Complete Payment';
    }
  };
  
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };
  
  const handleCheckout = () => {
    // Handle different payment flows based on the selected method
    switch(paymentMethod) {
      case 'stripe':
        // Redirect to Stripe checkout
        console.log('Redirecting to Stripe checkout');
        break;
      case 'venmo':
        // Redirect to Venmo
        console.log('Redirecting to Venmo');
        break;
      case 'apple':
        // Process Apple Pay
        console.log('Processing Apple Pay');
        break;
      case 'cash':
        // Show cash payment instructions
        console.log('Cash payment selected');
        break;
      default:
        console.log('Processing payment');
    }
  };
  
  useEffect(() => {
    // Close credit card info tooltip when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (creditCardInfoRef.current && !creditCardInfoRef.current.contains(event.target as Node)) {
        setShowCreditCardInfo(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
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
            <HeaderTitle><span className="husky">Husky</span><span className="mart">Mart</span></HeaderTitle>
          </LogoContainer>
          
          <BackButton onClick={handleBackClick} style={{ margin: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back to Cart
          </BackButton>
        </Header>
        
        <CheckoutContainer>
          <MainContent>            
            <PageTitle>Checkout</PageTitle>
            
            <Section>
              <SectionTitle>Pay with</SectionTitle>
              <PaymentMethodsGrid>
                <PaymentMethodOption>
                  <PaymentRadio 
                    type="radio" 
                    name="paymentMethod" 
                    value="stripe" 
                    checked={paymentMethod === 'stripe'} 
                    onChange={handlePaymentMethodChange}
                  />
                  <PaymentLogo>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" />
                  </PaymentLogo>
                  <PaymentLabel>Stripe {paymentMethod === 'stripe' && <DiscountBadge>2% Discount</DiscountBadge>}</PaymentLabel>
                </PaymentMethodOption>
                
                <PaymentMethodOption>
                  <PaymentRadio 
                    type="radio" 
                    name="paymentMethod" 
                    value="cash" 
                    checked={paymentMethod === 'cash'} 
                    onChange={handlePaymentMethodChange}
                  />
                  <PaymentLogo>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" 
                    fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" 
                    strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M12 3v18M17 5H9a3 3 0 0 0 0 6h6a3 3 0 1 1 0 6H7" />
                  </svg>
                  </PaymentLogo>
                  <PaymentLabel>Cash (In-Person)</PaymentLabel>
                </PaymentMethodOption>
                {paymentMethod === 'cash' && (
                  <CashWarning>
                    Note: Cash payments do not receive the 2% online payment discount, resulting in a higher effective fee (3% versus 1% for online payments).
                  </CashWarning>
                )}
                
                <PaymentMethodOption>
                  <PaymentRadio 
                    type="radio" 
                    name="paymentMethod" 
                    value="venmo" 
                    checked={paymentMethod === 'venmo'} 
                    onChange={handlePaymentMethodChange}
                  />
                  <PaymentLogo>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px">
                        <path fill="#4b7bb2" d="M35.718,43.986c-3.092,0.147-7.816,0.585-12.801,0.556c-2.809-0.016-10.211,0.173-10.211,0.173 c-4.728,0-8.45-3.76-9.041-8.451c-0.202-1.601-0.767-4.98-0.58-6.478c0.398-3.196-0.219-8.009-0.083-9.326 c0.617-5.993,0.318-6.244,0.083-8.308C2.549,7.453,6.923,3.356,11.646,3.59c4.112,0.203,12.317,1.221,16.447,0.854 c3.11-0.276,5.41-0.727,7.224-0.854c4.717-0.33,8.529,2.544,8.561,8.561c0.009,1.612,0.585,3.57,0.527,6.425 c-0.07,3.469-0.495,6.546-0.527,8.105c-0.047,2.285-0.008,6.856,0,9.142C43.894,40.55,42.147,43.679,35.718,43.986z"/>
                        <path fill="#010101" d="M12.718,45.215c-4.812,0-8.912-3.822-9.549-8.889c-0.038-0.303-0.089-0.671-0.146-1.078 c-0.25-1.792-0.593-4.247-0.434-5.524c0.243-1.95,0.094-4.603-0.014-6.541c-0.07-1.252-0.125-2.241-0.07-2.775 c0.516-5.003,0.388-5.929,0.195-7.331c-0.037-0.265-0.075-0.545-0.112-0.869C2.333,9.977,3.13,7.692,4.774,5.939 c1.79-1.908,4.371-2.968,6.896-2.849c1.284,0.063,2.983,0.208,4.781,0.36c3.917,0.332,8.791,0.745,11.596,0.496 c1.625-0.145,3.025-0.336,4.26-0.506c1.125-0.155,2.097-0.288,2.974-0.349c2.527-0.177,4.811,0.548,6.421,2.041 c1.734,1.608,2.659,4.035,2.675,7.017c0.003,0.624,0.098,1.313,0.207,2.113c0.167,1.215,0.354,2.592,0.32,4.324 c-0.042,2.096-0.212,4.042-0.349,5.606c-0.089,1.015-0.165,1.891-0.178,2.499c-0.038,1.801-0.021,5.06-0.008,7.439l0.008,1.69 c0.02,5.707-2.644,8.379-8.636,8.665l0,0c-0.854,0.041-1.834,0.104-2.909,0.173c-2.806,0.181-6.296,0.4-9.919,0.384 C20.14,45.031,12.792,45.213,12.718,45.215z M11.267,4.081c-2.124,0-4.255,0.935-5.763,2.542c-1.464,1.561-2.147,3.504-1.923,5.472 c0.036,0.316,0.074,0.588,0.109,0.846c0.203,1.473,0.336,2.447-0.191,7.57c-0.047,0.456,0.009,1.458,0.074,2.617 c0.116,2.085,0.261,4.68,0.007,6.72c-0.143,1.146,0.204,3.623,0.433,5.262c0.057,0.412,0.109,0.784,0.148,1.091 c0.575,4.569,4.248,8.014,8.544,8.014c0.061-0.001,7.438-0.179,10.214-0.173c3.582,0.024,7.059-0.202,9.849-0.382 c1.082-0.069,2.066-0.133,2.926-0.174l0,0c5.475-0.261,7.701-2.48,7.684-7.662l-0.008-1.688c-0.013-2.385-0.03-5.651,0.008-7.465 c0.013-0.641,0.091-1.533,0.182-2.565c0.135-1.549,0.304-3.477,0.345-5.54c0.034-1.653-0.149-2.989-0.311-4.168 c-0.114-0.834-0.212-1.555-0.216-2.243c-0.015-2.699-0.829-4.873-2.355-6.289c-1.425-1.322-3.389-1.938-5.671-1.776 c-0.843,0.059-1.799,0.19-2.907,0.342c-1.246,0.171-2.659,0.365-4.307,0.511C25.245,5.201,20.53,4.8,16.368,4.447 c-1.79-0.151-3.479-0.295-4.747-0.357C11.503,4.083,11.385,4.081,11.267,4.081z"/>
                        <path fill="#d6e5e5" d="M11.693,11.953c1.442-0.099,2.652-0.14,4.12-0.14c1.999,0,3.657-0.452,5.563-0.313 c0.169,3.01,0.989,5.365,1.25,8.313c0.238,2.686,0.246,6.972,1.042,9.521c0.814-0.226,2.138-3.798,2.525-4.695 c0.693-1.608,1.219-3.014,1.652-4.736c0.57-2.263,1.043-5.81-0.344-7.84c1.428-0.022,3.693-0.383,5.062-0.813 c1.302-0.408,2.12-0.612,3.582-0.52c1.23,2.083,1.411,6.328,1.355,7.458c-0.162,3.275-1.187,5.295-2.813,8.063 c-0.818,1.392-2.249,3.836-2.937,5.313C31.038,33.09,27,37.5,27,37.5s-4.477-0.188-6.188-0.188c-1.097,0-3.441,0.476-4.437,0.125 c-0.125-0.438-0.69-3.709-1.059-5.644c-0.426-2.239-0.789-4.291-1.406-6.474c-0.675-2.391-0.711-4.955-1.245-7.403 C12.227,15.903,11.693,14.054,11.693,11.953z"/>
                        <path fill="#010101" d="M17.423,38.066c-0.517,0-0.913-0.052-1.214-0.157c-0.153-0.054-0.271-0.179-0.314-0.334 c-0.08-0.281-0.28-1.376-0.601-3.139c-0.161-0.891-0.329-1.816-0.469-2.55l-0.138-0.729c-0.368-1.944-0.716-3.78-1.259-5.704 c-0.391-1.383-0.573-2.829-0.75-4.229c-0.135-1.061-0.273-2.157-0.501-3.204c-0.08-0.366-0.163-0.727-0.246-1.085 c-0.38-1.65-0.739-3.21-0.739-4.984c0-0.263,0.203-0.48,0.466-0.499c1.463-0.1,2.666-0.141,4.154-0.141 c0.856,0,1.665-0.087,2.447-0.172c1.006-0.108,2.052-0.217,3.151-0.14c0.251,0.019,0.449,0.22,0.463,0.471 c0.089,1.578,0.355,2.947,0.638,4.396c0.24,1.231,0.488,2.505,0.611,3.9c0.063,0.719,0.111,1.552,0.161,2.437 c0.119,2.087,0.251,4.413,0.647,6.176c0.37-0.592,0.896-1.722,1.567-3.374c0.096-0.235,0.175-0.432,0.233-0.566 c0.774-1.8,1.246-3.149,1.627-4.66c0.389-1.546,1.141-5.366-0.272-7.436c-0.104-0.152-0.115-0.349-0.031-0.512 c0.085-0.164,0.253-0.268,0.437-0.271c1.395-0.021,3.603-0.376,4.921-0.79c1.244-0.39,2.166-0.64,3.763-0.542 c0.165,0.011,0.314,0.102,0.399,0.245c1.271,2.152,1.489,6.424,1.424,7.736c-0.17,3.432-1.301,5.601-2.88,8.291 c-0.722,1.228-2.222,3.782-2.916,5.271c-0.736,1.58-4.667,5.882-4.834,6.064c-0.1,0.109-0.233,0.164-0.39,0.162 c-0.045-0.002-4.486-0.188-6.167-0.188c-0.341,0-0.842,0.053-1.371,0.108C18.792,37.989,18.057,38.066,17.423,38.066z M16.794,37.026c0.562,0.087,1.648-0.006,2.543-0.1c0.557-0.059,1.082-0.114,1.476-0.114c1.497,0,5.024,0.14,5.976,0.179 c1.21-1.334,3.976-4.496,4.509-5.64c0.714-1.532,2.23-4.114,2.96-5.354c1.554-2.647,2.585-4.623,2.744-7.834 c0.056-1.138-0.131-4.94-1.16-6.948c-1.232-0.05-2.021,0.165-3.129,0.513c-1.158,0.363-2.965,0.683-4.39,0.794 c1.081,2.443,0.388,5.987,0.007,7.503c-0.395,1.565-0.881,2.96-1.679,4.812c-0.056,0.131-0.133,0.319-0.226,0.547 c-1.099,2.707-1.843,4.215-2.624,4.432c-0.264,0.076-0.53-0.075-0.611-0.332c-0.603-1.93-0.762-4.741-0.903-7.221 c-0.05-0.873-0.096-1.695-0.159-2.405c-0.119-1.343-0.361-2.591-0.597-3.797c-0.251-1.288-0.509-2.616-0.624-4.082 c-0.853-0.026-1.674,0.064-2.539,0.157c-0.809,0.088-1.645,0.178-2.555,0.178c-1.3,0-2.379,0.031-3.611,0.107 c0.057,1.479,0.373,2.85,0.705,4.292c0.083,0.361,0.167,0.727,0.248,1.097c0.237,1.091,0.379,2.21,0.517,3.292 c0.172,1.362,0.351,2.771,0.721,4.082c0.555,1.966,0.906,3.823,1.278,5.789l0.138,0.728c0.14,0.736,0.309,1.666,0.471,2.559 C16.47,35.313,16.682,36.482,16.794,37.026z"/>
                    </svg>
                  </PaymentLogo>
                  <PaymentLabel>Venmo {paymentMethod === 'venmo' && <DiscountBadge>2% Discount</DiscountBadge>}</PaymentLabel>
                </PaymentMethodOption>
                
                <PaymentMethodOption>
                  <PaymentRadio 
                    type="radio" 
                    name="paymentMethod" 
                    value="apple" 
                    checked={paymentMethod === 'apple'} 
                    onChange={handlePaymentMethodChange}
                  />
                  <PaymentLogo>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px">
                        <path d="M 9.984375 15.001953 C 9.149375 15.041953 8.1182969 15.573313 7.5292969 16.320312 C 6.9892969 16.964312 6.5275313 18.010188 6.6445312 18.992188 C 7.5875313 19.074188 8.5301406 18.500438 9.1191406 17.773438 C 9.6991406 17.026437 10.082375 16.024953 9.984375 15.001953 z M 18 17 L 18 32 L 20.375 32 L 20.375 27 L 23.625 27 C 26.608 27 28.75 24.925 28.75 22 C 28.75 19.075 26.647125 17 23.703125 17 L 18 17 z M 20.375 19 L 23.125 19 C 25.172 19 26.375 20.105 26.375 22 C 26.375 23.895 25.182 25 23.125 25 L 20.375 25 L 20.375 19 z M 9.875 19.5 C 8.5 19.5 7.517 20.25 6.875 20.25 C 6.223 20.25 5.25 19.509766 4.125 19.509766 C 2.75 19.509766 1.4033594 20.372859 0.69335938 21.630859 C -0.76564063 24.145859 0.31460937 27.869016 1.7246094 29.916016 C 2.4156094 30.930016 3.25 32 4.375 32 C 5.406 31.961 5.755 31.375 7 31.375 C 8.254 31.375 8.625 32 9.75 32 C 10.875 32 11.556094 30.969078 12.246094 29.955078 C 13.034094 28.805078 13.356 27.684 13.375 27.625 C 13.356 27.606 11.197734 26.77725 11.177734 24.28125 C 11.158734 22.19525 12.879031 21.200578 12.957031 21.142578 C 11.984031 19.700578 10.375 19.5 10 19.5 L 9.875 19.5 z M 34.199219 21 C 31.710219 21 29.870734 22.395453 29.802734 24.314453 L 31.912109 24.314453 C 32.086109 23.402453 32.948859 22.804688 34.130859 22.804688 C 35.563859 22.804688 36.373047 23.460969 36.373047 24.667969 L 36.375 25.5 L 33.443359 25.654297 C 30.722359 25.815297 29.25 26.908594 29.25 28.808594 C 29.25 30.727594 30.770219 32.001953 32.949219 32.001953 C 34.421219 32.001953 35.78725 31.270328 36.40625 30.111328 L 36.455078 30.111328 L 36.455078 31.886719 L 38.623047 31.886719 L 38.623047 24.515625 C 38.624047 22.376625 36.882219 21 34.199219 21 z M 39.5 21 L 43.507812 31.949219 L 43.292969 32.615234 C 42.930969 33.744234 42.344828 34.177734 41.298828 34.177734 C 41.119828 34.177734 40.781 34.159625 40.625 34.140625 L 40.625 35.945312 C 40.783 35.980313 41.332906 36 41.503906 36 C 43.810906 36 44.896703 35.132047 45.845703 32.498047 L 50 21 L 47.595703 21 L 44.808594 29.884766 L 44.759766 29.884766 L 41.972656 21 L 39.5 21 z M 36.375 27 L 36.367188 27.867188 C 36.367188 29.254188 35.166125 30.242188 33.578125 30.242188 C 32.329125 30.242188 31.535156 29.653953 31.535156 28.751953 C 31.535156 27.820953 32.300672 27.279359 33.763672 27.193359 L 36.375 27 z"/>
                    </svg>
                  </PaymentLogo>
                  <PaymentLabel>Apple Pay {paymentMethod === 'apple' && <DiscountBadge>2% Discount</DiscountBadge>}</PaymentLabel>
                </PaymentMethodOption>
              </PaymentMethodsGrid>
              
              <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: huskyTheme.colors.lightText, position: 'relative' }}>
                All purchases include a 3% transaction fee. Online payments receive a 2% discount (effectively a 1% fee). Cash payments incur the full 3% fee.
                <InfoIconContainer>
                  <InfoIcon onClick={() => setShowCreditCardInfo(!showCreditCardInfo)}>i</InfoIcon>
                  {showCreditCardInfo && (
                    <InfoTooltip ref={creditCardInfoRef}>
                      Online payments through Stripe, Venmo, or Apple Pay receive a 2% discount, resulting in a net fee of 1%. Cash payments don't receive this discount, resulting in the full 3% fee.
                    </InfoTooltip>
                  )}
                </InfoIconContainer>
              </div>
            </Section>
            
            <OrderItemsSection>
              <SectionTitle>Order Items</SectionTitle>
              
              {cartItems.map(item => (
                <OrderItem key={item.id}>
                  <ItemImage>
                    <img src={item.image} alt={item.title} />
                  </ItemImage>
                  <ItemDetails>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemSeller>Seller: {item.seller}</ItemSeller>
                    <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
                  </ItemDetails>
                </OrderItem>
              ))}
            </OrderItemsSection>
            
            <DonationSection>
              <SectionTitle>Support UniMart</SectionTitle>
              
              <DonationOption onClick={() => setRoundUpDonation(!roundUpDonation)}>
                <PaymentRadio 
                  type="checkbox" 
                  checked={roundUpDonation} 
                  onChange={() => setRoundUpDonation(!roundUpDonation)}
                />
                <div>
                  <PaymentLabel>Round up to the nearest dollar</PaymentLabel>
                  <div style={{ fontSize: '0.9rem', color: huskyTheme.colors.lightText }}>
                    Your total will be rounded up from ${(calculateSubtotal() + calculateTax() - calculateDiscount() + calculateTransactionFee()).toFixed(2)} to ${Math.ceil(calculateSubtotal() + calculateTax() - calculateDiscount() + calculateTransactionFee())}
                  </div>
                </div>
              </DonationOption>
              
              <DonationInfo>
                Your donation helps keep UniMart growing, allowing us to improve our platform and better serve the student community.
              </DonationInfo>
            </DonationSection>
          </MainContent>
          
          <SidePanel>
            <OrderSummarySection>
              <SectionTitle>Order Summary</SectionTitle>
              
              <SummaryItem>
                <span>Item(s)<ItemCountLabel>({cartItems.length})</ItemCountLabel></span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </SummaryItem>
              
              <SummaryItem>
                <span>Estimated Tax</span>
                <span>${calculateTax().toFixed(2)}</span>
              </SummaryItem>
              
              <SummaryItem>
                <span>Transaction Fee (3%)</span>
                <span>${calculateTransactionFee().toFixed(2)}</span>
              </SummaryItem>
              
              {paymentMethod !== 'cash' && (
                <SummaryItem>
                  <span>Online Payment Discount (2%)</span>
                  <span>-${calculateDiscount().toFixed(2)}</span>
                </SummaryItem>
              )}
              
              {roundUpDonation && (
                <SummaryItem>
                  <span>Donation</span>
                  <span>${calculateDonation().toFixed(2)}</span>
                </SummaryItem>
              )}
              
              <SummaryItem isLast>
                <span>Order total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </SummaryItem>
              
              <CheckoutButton onClick={handleCheckout}>
                {getPaymentButtonText()}
              </CheckoutButton>
              
              <LegalSection>
                By placing your order, you agree to UniMart's <LegalLink href="/user-agreement">User Agreement</LegalLink> and <LegalLink href="/privacy-notice">Privacy Notice</LegalLink>.
              </LegalSection>
            </OrderSummarySection>
          </SidePanel>
        </CheckoutContainer>
      </Container>
    </ThemeProvider>
  );
};

export default CheckoutPage; 