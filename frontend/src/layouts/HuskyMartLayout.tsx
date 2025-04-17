import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Reuse or adapt Header components from other pages if needed
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
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
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: white;
  
  .husky {
    color: white;
  }
  
  .mart {
    color: ${props => props.theme.colors.primary};
  }
`;

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex-grow: 1;
  /* Add any necessary padding or styles for the main content area */
`;

const HuskyMartLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/huskymart'); // Navigate to the base huskymart route
  };

  return (
    <LayoutContainer>
      <Header>
        <LogoContainer onClick={handleLogoClick}>
           {/* You might want a specific HuskyMart logo/icon here */}
           <HeaderTitle>
             <span className="husky">Husky</span><span className="mart">Mart</span>
           </HeaderTitle>
         </LogoContainer>
         {/* Add other header actions if needed (e.g., search, user profile icon) */}
       </Header>
       <MainContent>
         <Outlet /> {/* This renders the matched child route component */}
       </MainContent>
       {/* Add a Footer component here if needed */}
     </LayoutContainer>
   );
 };

export default HuskyMartLayout; 