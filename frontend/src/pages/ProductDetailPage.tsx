import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { motion } from 'framer-motion';

// Styled components
const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  color: #000000;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryLight};
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

// Northeastern University theme
const huskyTheme = {
  colors: {
    primary: '#D41B2C', // Northeastern Red
    secondary: '#000000', // Black
    accent: '#D41B2C', 
    background: '#FFFFFF', 
    cardBackground: '#FFFFFF',
    card: '#FFFFFF',
    text: '#000000',
    lightText: '#666666',
    border: '#DDDDDD',
    error: '#D41B2C',
    success: '#28A745',
    inputBackground: '#FFFFFF',
    primaryLight: 'rgba(212, 27, 44, 0.1)',
    teal: '#00BFB3',
    headerBg: '#000000',
    navBg: '#EFEFEF',
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

// Styled components
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

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
`;

const BreadcrumbLink = styled.span`
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    text-decoration: underline;
  }
`;

const BreadcrumbSeparator = styled.span`
  color: ${props => props.theme.colors.border};
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.medium};
  aspect-ratio: 1;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const ImagePlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: ${props => props.theme.colors.lightText};
  font-weight: 500;
`;

const ConditionBadge = styled.div<{ condition: string }>`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  color: white;
  background-color: ${props => {
    switch (props.condition) {
      case 'New': return '#28A745';
      case 'Like New': return '#20c997';
      case 'Good': return '#17a2b8';
      case 'Fair': return '#fd7e14';
      case 'Poor': return '#dc3545';
      default: return '#6c757d';
    }
  }};
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: ${props => props.theme.colors.text};
`;

const ProductPrice = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1.5rem;
`;

const ProductDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};
`;

const SellerInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.primaryLight};
`;

const SellerAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #f0f0f0;
  margin-right: 1rem;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SellerDetails = styled.div`
  flex: 1;
`;

const SellerName = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const ItemPostedTime = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.lightText};
`;

const ContactSellerButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #17a2b8;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #138496;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled.button`
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #b01624;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const SecondaryButton = styled.button`
  flex: 1;
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background-color: white;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryLight};
    border-color: ${props => props.theme.colors.primary};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

// New styled components for bidding
interface BidFormProps {
  disabled?: boolean;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}

const BidForm = styled.form<BidFormProps>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: #000000;
  
  ${props => props.disabled && `
    opacity: 0.6;
    pointer-events: none;
  `}
`;

const BidInput = styled(Input)`
  width: 100%;
  max-width: 200px;
`;

const BidHistory = styled.div`
  margin-top: 1.5rem;
  color: #000000;
`;

const BidItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  color: #000000;
  
  &:last-child {
    border-bottom: none;
  }
`;

const BidAmount = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const BidTime = styled.span`
  color: #000000;
  font-size: 0.875rem;
`;

// Define our mock product data - in a real app, this would come from an API
interface Bid {
  id: number;
  amount: number;
  bidder: string;
  time: string;
  status: 'pending' | 'accepted' | 'declined';
}

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  condition: string;
  category: string;
  seller: {
    name: string;
    image?: string;
  };
  postedTime: string;
  image?: string;
  allowsBidding: boolean;
  currentBid?: number;
  bids?: Bid[];
  hasPendingBid?: boolean;
}

const mockProducts: Record<string, Product> = {
  '1': {
    id: 1,
    title: 'Textbook for CS2800',
    price: 49.99,
    description: 'Discrete Structures textbook for CS2800. In good condition with minimal highlighting. Perfect for next semester!',
    condition: 'Good',
    category: 'textbooks',
    seller: {
      name: 'John Doe',
    },
    postedTime: '3 days ago',
    allowsBidding: true,
    currentBid: 40,
    bids: [
      {
        id: 1,
        amount: 40,
        bidder: 'Jane Smith',
        time: '2 days ago',
        status: 'pending'
      }
    ]
  },
  '2': {
    id: 2,
    title: 'iPhone 14 Pro Max',
    price: 899.99,
    description: 'iPhone 14 Pro Max, 256GB, Deep Purple. Used for 6 months, in perfect condition. Comes with original box, charger, and an extra case.',
    condition: 'Like New',
    category: 'electronics',
    seller: {
      name: 'Jane Smith',
    },
    postedTime: '1 day ago',
    allowsBidding: false
  },
};

// New styled components for the success popup
const PopupOverlay = styled.div`
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

const PopupContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #000000;
  padding: 0.5rem;
  line-height: 1;
`;

const PopupTitle = styled.h3`
  margin-bottom: 1rem;
  color: #000000;
`;

const PopupMessage = styled.p`
  margin-bottom: 1.5rem;
  color: #000000;
`;

const PopupButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin: 0 0.5rem;
`;

// Main component
const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const [showBidSuccess, setShowBidSuccess] = useState(false);
  
  useEffect(() => {
    // In a real app, fetch product data from an API
    if (productId && mockProducts[productId]) {
      setProduct(mockProducts[productId]);
    }
  }, [productId]);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleLogoClick = () => {
    navigate('/huskymart');
  };
  
  const handleCartClick = () => {
    navigate('/shopping-cart');
  };
  
  const handleCategoryClick = () => {
    if (product) {
      navigate(`/huskymart/category/${product.category}`);
    }
  };
  
  const handleContactSeller = () => {
    // In a real app, navigate to messages with this seller
    alert(`Opening chat with ${product?.seller.name}...`);
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    
    // Mock adding to cart
    setTimeout(() => {
      // Get existing cart items from localStorage, or initialize empty array
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Check if product is already in cart
      const existingProductIndex = cartItems.findIndex((item: any) => item.id === product.id);
      
      if (existingProductIndex >= 0) {
        // Product exists in cart, increment quantity
        cartItems[existingProductIndex].quantity += 1;
      } else {
        // Product is not in cart, add it with quantity 1
        cartItems.push({
          id: product.id,
          title: product.title,
          price: product.price,
          condition: product.condition,
          seller: product.seller.name,
          image: product.image,
          quantity: 1,
          checked: true
        });
      }
      
      // Save updated cart back to localStorage
      localStorage.setItem('cart', JSON.stringify(cartItems));
      
      setIsAddingToCart(false);
      
      // Show success message
      alert('Product added to cart!');
    }, 500);
  };
  
  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !bidAmount) return;
    
    // Check if user already has a pending bid
    if (product.hasPendingBid) {
      alert('You already have a pending bid. Please wait for the seller to respond.');
      return;
    }
    
    const bidValue = parseFloat(bidAmount);
    if (isNaN(bidValue) || bidValue >= product.price) {
      alert('Bid amount must be less than the asking price');
      return;
    }
    
    setIsSubmittingBid(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would be an API call
      const newBid = {
        id: Date.now(),
        amount: bidValue,
        bidder: 'Current User', // This would be the actual user's name
        time: 'Just now',
        status: 'pending' as const
      };
      
      setProduct(prev => {
        if (!prev) return null;
        return {
          ...prev,
          currentBid: bidValue,
          bids: [...(prev.bids || []), newBid],
          hasPendingBid: true
        };
      });
      
      setBidAmount('');
      setIsSubmittingBid(false);
      setShowBidSuccess(true);
    }, 1000);
  };
  
  const handleClosePopup = () => {
    setShowBidSuccess(false);
  };
  
  const handleGoToMarketplace = () => {
    const school = sessionStorage.getItem('school') || 'HuskyMart';
    navigate(`/${school.toLowerCase()}`);
  };
  
  if (!product) {
    return (
      <ThemeProvider theme={huskyTheme}>
        <Container>
          <Header>
            <LogoContainer onClick={handleLogoClick}>
              <CartIcon viewBox="0 0 24 24" onClick={handleCartClick}>
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </CartIcon>
              <CartTooltip>View Cart</CartTooltip>
              <HeaderTitle><span className="husky">Husky</span><span className="mart">Mart</span></HeaderTitle>
            </LogoContainer>
            
            <HeaderActions>
              <IconButton title="View Cart" onClick={handleCartClick}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </IconButton>
            </HeaderActions>
          </Header>
          
          <Main>
            <p>Product not found.</p>
          </Main>
        </Container>
      </ThemeProvider>
    );
  }
  
  return (
    <ThemeProvider theme={huskyTheme}>
      <Container>
        <Header>
          <LogoContainer onClick={handleLogoClick}>
            <CartIcon viewBox="0 0 24 24" onClick={handleCartClick}>
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </CartIcon>
            <CartTooltip>View Cart</CartTooltip>
            <HeaderTitle><span className="husky">Husky</span><span className="mart">Mart</span></HeaderTitle>
          </LogoContainer>
          
          <HeaderActions>
            <IconButton title="View Cart" onClick={handleCartClick}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </IconButton>
          </HeaderActions>
        </Header>
        
        <Main>
          <Breadcrumb>
            <BreadcrumbLink onClick={handleLogoClick}>HuskyMart</BreadcrumbLink>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbLink onClick={handleCategoryClick}>
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </BreadcrumbLink>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <span>{product.title}</span>
          </Breadcrumb>
          
          <ProductGrid>
            <ProductImageContainer>
              {product.image ? (
                <ProductImage src={product.image} alt={product.title} />
              ) : (
                <ImagePlaceholder>No Image Available</ImagePlaceholder>
              )}
              <ConditionBadge condition={product.condition}>
                {product.condition}
              </ConditionBadge>
            </ProductImageContainer>
            
            <ProductDetails>
              <ProductTitle>{product.title}</ProductTitle>
              <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
              <ProductDescription>{product.description}</ProductDescription>
              
              <SellerInfo>
                <SellerAvatar>
                  {product.seller.image && <img src={product.seller.image} alt={product.seller.name} />}
                </SellerAvatar>
                <SellerDetails>
                  <SellerName>Seller: {product.seller.name}</SellerName>
                  <ItemPostedTime>Posted: {product.postedTime}</ItemPostedTime>
                </SellerDetails>
                <ContactSellerButton onClick={handleContactSeller}>
                  Contact Seller
                </ContactSellerButton>
              </SellerInfo>
              
              {product.allowsBidding && (
                <>
                  <BidForm onSubmit={handleBidSubmit} disabled={product.hasPendingBid}>
                    <h3 style={{ color: '#000000' }}>Make an Offer</h3>
                    <p style={{ color: '#000000' }}>Current highest bid: ${product.currentBid || product.price}</p>
                    {product.hasPendingBid && (
                      <p style={{ color: '#000000', fontWeight: 'bold' }}>
                        You have a pending bid. Please wait for the seller to respond.
                      </p>
                    )}
                    <FormGroup>
                      <Label htmlFor="bidAmount">Your Bid ($)</Label>
                      <BidInput
                        type="number"
                        id="bidAmount"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        min="0"
                        max={product.price - 0.01}
                        step="0.01"
                        required
                        disabled={product.hasPendingBid}
                      />
                    </FormGroup>
                    <Button type="submit" disabled={isSubmittingBid || product.hasPendingBid}>
                      {isSubmittingBid ? 'Submitting...' : 'Submit Bid'}
                    </Button>
                  </BidForm>
                  
                  {product.bids && product.bids.length > 0 && (
                    <BidHistory>
                      <h3 style={{ color: '#000000' }}>Bid History</h3>
                      {product.bids.map(bid => (
                        <BidItem key={bid.id}>
                          <div>
                            <BidAmount>${bid.amount}</BidAmount>
                            <div style={{ color: '#000000' }}>by {bid.bidder}</div>
                          </div>
                          <BidTime>{bid.time}</BidTime>
                          {bid.status !== 'pending' && (
                            <span style={{ 
                              color: bid.status === 'accepted' ? 'green' : 'red',
                              fontWeight: 'bold'
                            }}>
                              {bid.status.toUpperCase()}
                            </span>
                          )}
                        </BidItem>
                      ))}
                    </BidHistory>
                  )}
                </>
              )}
              
              <ActionButtons>
                <PrimaryButton onClick={handleAddToCart} disabled={isAddingToCart}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"/>
                  </svg>
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </PrimaryButton>
                <SecondaryButton>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  Add to Favorites
                </SecondaryButton>
              </ActionButtons>
            </ProductDetails>
          </ProductGrid>
        </Main>
        
        {showBidSuccess && (
          <PopupOverlay>
            <PopupContent>
              <CloseButton onClick={handleClosePopup}>×</CloseButton>
              <PopupTitle>Success!</PopupTitle>
              <PopupMessage>
                The bid has been sent to the seller who will review it.
              </PopupMessage>
              <PopupButton onClick={handleGoToMarketplace}>
                Back to {sessionStorage.getItem('school') || 'HuskyMart'}'s Main Page
              </PopupButton>
            </PopupContent>
          </PopupOverlay>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default ProductDetailPage; 