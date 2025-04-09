import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import theme from '../theme';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  color: ${props => props.theme.colors.text};
`;

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

const NavigationButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  color: white;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.text};
`;

const Content = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: black;
  line-height: 1.6;
  
  h2 {
    color: black;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
  
  p, li {
    color: black;
    margin-bottom: 1rem;
  }
  
  ul {
    margin-left: 2rem;
    margin-bottom: 1rem;
  }
`;

const UserAgreementPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    navigate('/huskymart');
  };

  const handleBackClick = () => {
    if (location.state?.fromCheckout) {
      navigate('/checkout');
    } else {
      navigate(-1);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Header>
        <LogoContainer onClick={handleLogoClick}>
          <CartIcon viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </CartIcon>
          <HeaderTitle><span className="husky">Husky</span><span className="mart">Mart</span></HeaderTitle>
        </LogoContainer>
        
        <NavigationButtons>
          <NavButton onClick={handleBackClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Leave this Mumbo Jumbo (Previous Page)
          </NavButton>
        </NavigationButtons>
      </Header>

      <Container>
        <Title>UniMart User Agreement</Title>
        <Content>
          <p>Effective Date: 04/09/2025</p>
          
          <p>Welcome to UniMart, a student-to-student marketplace platform. This User Agreement ("Agreement") governs your use of the UniMart platform, website, services, and applications ("UniMart," "we," "our," or "us").</p>
          
          <p>By creating an account, accessing, or using UniMart in any manner, you agree to be legally bound by this Agreement and all applicable laws and regulations. If you do not agree with any part of this Agreement, you may not access or use UniMart.</p>
          
          <h2>1. Eligibility and Account Access</h2>
          <ul>
            <li>You must be at least 18 years of age or the legal age of majority in your jurisdiction to use UniMart.</li>
            <li>You must register with a valid and verifiable .edu email address from a recognized educational institution within the United States.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials, including any device marked as "trusted."</li>
            <li>You agree to notify UniMart immediately of any unauthorized use of your account.</li>
          </ul>
          
          <h2>2. Permitted Use</h2>
          <ul>
            <li>UniMart is designed solely for personal, non-commercial, peer-to-peer transactions among verified students.</li>
            <li>You may not resell or commercially distribute any content or platform functionality without prior written permission.</li>
            <li>You agree not to access or use the platform for any purpose that is unlawful or prohibited by this Agreement.</li>
          </ul>
          
          <h2>3. Prohibited Items and Conduct</h2>
          <p>UniMart strictly prohibits the listing, sale, or discussion of the following:</p>
          <ul>
            <li>Illegal drugs, controlled substances, and paraphernalia</li>
            <li>Alcohol, tobacco, vaping products, or cannabis derivatives</li>
            <li>Firearms, ammunition, weapons, or explosive materials</li>
            <li>Human or animal remains or body parts</li>
            <li>Hazardous materials or chemicals</li>
            <li>Stolen, counterfeit, or pirated goods</li>
            <li>Pornographic, obscene, or sexually explicit materials</li>
            <li>Gift cards, digital goods with license transfers, or access codes</li>
            <li>Academic services (e.g., essay writing, test taking)</li>
            <li>Any item or service that violates local, state, or federal laws</li>
          </ul>
          
          <p>Additionally, the following behaviors are prohibited:</p>
          <ul>
            <li>Harassment, threats, or abusive conduct toward users or UniMart staff</li>
            <li>Fee circumvention (e.g., initiating purchases off-platform to avoid charges)</li>
            <li>Deceptive, fraudulent, or misleading listings or communications</li>
            <li>Posting false reviews or feedback, or manipulating reputation systems</li>
            <li>Spamming, phishing, or exploiting platform vulnerabilities</li>
          </ul>
          
          <p>Violation of these terms may result in immediate suspension or termination of your account.</p>
          
          <h2>4. Payment, Fees, and Processing</h2>
          <ul>
            <li>UniMart charges a 5% platform fee on all transactions.</li>
            <li>If a purchase is made through the app, the 5% fee is applied to the agreed-upon purchase price.</li>
            <li>If a transaction is completed in cash (allowed only for items under $50), the 5% fee is automatically deducted from the seller's linked bank account based on the original listing price.</li>
            <li>All transactions through the platform are processed by Stripe. A 2% processing fee applies to card payments, payable by the buyer.</li>
            <li>UniMart does not support refunds for cash transactions and bears no liability for disputes arising from such payments.</li>
            <li>Prices and fees may be updated at our discretion, with or without prior notice.</li>
          </ul>
          
          <h2>5. Cash Transaction Restrictions</h2>
          <ul>
            <li>Cash transactions are permitted only for items listed at $50 or less.</li>
            <li>Buyers and sellers must explicitly agree to a cash payment during transaction setup. Once confirmed, this cannot be changed.</li>
            <li>The seller remains obligated to pay the platform fee as described above.</li>
          </ul>
          
          <h2>6. Dispute Resolution and Buyer Protection</h2>
          <ul>
            <li>In-app transactions are eligible for UniMart dispute mediation if raised within 72 hours of confirmed delivery.</li>
            <li>Disputes involving cash payments are not covered.</li>
            <li>Buyers must confirm receipt of items to release funds to sellers.</li>
            <li>All sales are final unless otherwise explicitly stated by the seller.</li>
          </ul>
          
          <h2>7. Taxes</h2>
          <ul>
            <li>Buyers are responsible for any applicable sales taxes on purchases.</li>
            <li>UniMart, as a marketplace facilitator, will calculate, collect, and remit sales tax on taxable items sold through Stripe on behalf of the seller, where legally required.</li>
            <li>For cash transactions, sellers are solely responsible for complying with applicable state or federal tax obligations. UniMart disclaims any responsibility for such compliance.</li>
          </ul>
          
          <h2>8. Account Suspension and Termination</h2>
          <p>We reserve the right to restrict or terminate user accounts for:</p>
          <ul>
            <li>Violations of any term within this Agreement</li>
            <li>Excessive buyer or seller complaints</li>
            <li>Attempts to evade payment of platform fees</li>
            <li>Listing of prohibited or illegal items</li>
            <li>Abuse of dispute resolution procedures</li>
          </ul>
          
          <p>Account suspensions may be temporary or permanent at UniMart's sole discretion. Users who are permanently banned may not re-register using alternate emails or identities.</p>
          
          <h2>9. Limitation of Liability</h2>
          <ul>
            <li>UniMart is not responsible for the conduct of users or the outcome of physical meetups.</li>
            <li>We do not guarantee the quality, legality, or safety of listed items.</li>
            <li>To the fullest extent allowed by law, UniMart and its affiliates disclaim all warranties, express or implied.</li>
            <li>In no event shall UniMart be liable for indirect, consequential, or punitive damages.</li>
          </ul>
          
          <h2>10. Amendments and Governing Law</h2>
          <ul>
            <li>UniMart reserves the right to amend this Agreement at any time. We will notify users via email or platform announcements.</li>
            <li>Continued use of the platform constitutes acceptance of the revised terms.</li>
            <li>This Agreement is governed by and construed in accordance with the laws of the Commonwealth of Massachusetts, without regard to its conflict of law principles.</li>
          </ul>
          
          <p>Contact: studentunimart@gmail.com</p>
        </Content>
      </Container>
    </ThemeProvider>
  );
};

export default UserAgreementPage; 