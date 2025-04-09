import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BidNotifications from '../components/BidNotifications';

type BidStatus = 'pending' | 'accepted' | 'declined';

interface Bid {
  id: number;
  productId: number;
  productTitle: string;
  amount: number;
  bidder: string;
  time: string;
  status: BidStatus;
}

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

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: white;
  
  .uni {
    color: white;
  }
  
  .mart {
    color: ${props => props.theme.colors.primary};
  }
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.text};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.small};
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
`;

const EmptyStateText = styled.p`
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 1.5rem;
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
`;

// Update mock data with proper typing
const mockBids: Bid[] = [
  {
    id: 1,
    productId: 1,
    productTitle: 'Textbook for CS2800',
    amount: 40,
    bidder: 'Jane Smith',
    time: '2 days ago',
    status: 'pending'
  },
  {
    id: 2,
    productId: 2,
    productTitle: 'MacBook Pro',
    amount: 800,
    bidder: 'John Doe',
    time: '1 day ago',
    status: 'pending'
  }
];

const BidManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [bids, setBids] = useState<Bid[]>(mockBids);
  
  const handleLogoClick = () => {
    navigate('/huskymart');
  };
  
  const handleAcceptBid = (bidId: number) => {
    // In a real app, this would be an API call
    setBids(prev => prev.map(bid => 
      bid.id === bidId ? { ...bid, status: 'accepted' } : bid
    ));
    
    // Show success message
    alert('Bid accepted! The buyer has 5 days to complete the purchase.');
  };
  
  const handleDeclineBid = (bidId: number, reason: string, counterOffer?: number) => {
    // In a real app, this would be an API call
    setBids(prev => prev.map(bid => 
      bid.id === bidId ? { ...bid, status: 'declined' } : bid
    ));
    
    // Show success message
    alert('Bid declined' + (counterOffer ? ` with counter offer of $${counterOffer}` : '') + '.');
  };
  
  return (
    <Container>
      <Header>
        <LogoContainer onClick={handleLogoClick}>
          <HeaderTitle>
            <span className="uni">Uni</span>
            <span className="mart">Mart</span>
          </HeaderTitle>
        </LogoContainer>
      </Header>
      
      <Main>
        <Title>Manage Bids</Title>
        
        {bids.length > 0 ? (
          <BidNotifications
            bids={bids}
            onAcceptBid={handleAcceptBid}
            onDeclineBid={handleDeclineBid}
          />
        ) : (
          <EmptyState>
            <EmptyStateTitle>No Bids Yet</EmptyStateTitle>
            <EmptyStateText>
              You haven't received any bids on your items yet. When you do, they'll appear here.
            </EmptyStateText>
            <Button onClick={() => navigate('/huskymart')}>
              Back to Marketplace
            </Button>
          </EmptyState>
        )}
      </Main>
    </Container>
  );
};

export default BidManagementPage; 