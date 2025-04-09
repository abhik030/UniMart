import React, { useState } from 'react';
import styled from 'styled-components';

interface Bid {
  id: number;
  productId: number;
  productTitle: string;
  amount: number;
  bidder: string;
  time: string;
  status: 'pending' | 'accepted' | 'declined';
}

interface BidNotificationsProps {
  bids: Bid[];
  onAcceptBid: (bidId: number) => void;
  onDeclineBid: (bidId: number, reason: string, counterOffer?: number) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BidCard = styled.div<{ status: string }>`
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: ${props => props.theme.shadows.small};
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'pending': return props.theme.colors.warning;
      case 'accepted': return props.theme.colors.success;
      case 'declined': return props.theme.colors.error;
      default: return props.theme.colors.border;
    }
  }};
`;

const BidHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const BidTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
`;

const BidTime = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.lightText};
`;

const BidDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const BidAmount = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const BidderInfo = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const AcceptButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.colors.success};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.successDark};
  }
`;

const DeclineButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.colors.error};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.errorDark};
  }
`;

const CounterOfferForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Textarea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 80px;
`;

const CounterOfferInput = styled.input`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 0.875rem;
`;

const BidNotifications: React.FC<BidNotificationsProps> = ({ bids, onAcceptBid, onDeclineBid }) => {
  const [decliningBidId, setDecliningBidId] = useState<number | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [counterOffer, setCounterOffer] = useState('');

  const handleDeclineSubmit = (e: React.FormEvent, bidId: number) => {
    e.preventDefault();
    onDeclineBid(bidId, declineReason, counterOffer ? parseFloat(counterOffer) : undefined);
    setDecliningBidId(null);
    setDeclineReason('');
    setCounterOffer('');
  };

  return (
    <Container>
      {bids.map(bid => (
        <BidCard key={bid.id} status={bid.status}>
          <BidHeader>
            <BidTitle>{bid.productTitle}</BidTitle>
            <BidTime>{bid.time}</BidTime>
          </BidHeader>
          
          <BidDetails>
            <BidAmount>${bid.amount}</BidAmount>
            <BidderInfo>Bid by {bid.bidder}</BidderInfo>
          </BidDetails>
          
          {bid.status === 'pending' && (
            <>
              <ActionButtons>
                <AcceptButton onClick={() => onAcceptBid(bid.id)}>
                  Accept Bid
                </AcceptButton>
                <DeclineButton onClick={() => setDecliningBidId(bid.id)}>
                  Decline Bid
                </DeclineButton>
              </ActionButtons>
              
              {decliningBidId === bid.id && (
                <CounterOfferForm onSubmit={(e) => handleDeclineSubmit(e, bid.id)}>
                  <Textarea
                    placeholder="Reason for declining (optional)"
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                  />
                  <CounterOfferInput
                    type="number"
                    placeholder="Counter offer amount (optional)"
                    value={counterOffer}
                    onChange={(e) => setCounterOffer(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                  <ActionButtons>
                    <DeclineButton type="submit">Submit</DeclineButton>
                    <DeclineButton type="button" onClick={() => setDecliningBidId(null)}>
                      Cancel
                    </DeclineButton>
                  </ActionButtons>
                </CounterOfferForm>
              )}
            </>
          )}
        </BidCard>
      ))}
    </Container>
  );
};

export default BidNotifications; 