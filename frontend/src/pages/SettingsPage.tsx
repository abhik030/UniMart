import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

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

const LogoTooltip = styled(CartTooltip)`
  ${LogoContainer}:hover & {
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

const Main = styled.main`
  display: flex;
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0 1rem;
  }
`;

const Sidebar = styled.aside`
  width: 250px;
  flex-shrink: 0;
  margin-right: 2rem;
  
  @media (max-width: 768px) {
    width: 100%;
    margin-right: 0;
    margin-bottom: 2rem;
  }
`;

const Content = styled.div`
  flex: 1;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadows.small};
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

const CardHeader = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.primaryLight};
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #000000;
`;

const CardBody = styled.div`
  padding: 1.25rem;
`;

const PrivacyText = styled.p`
  color: #000000;
  margin-bottom: 1.5rem;
`;

const SidebarMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SidebarMenuItem = styled.li<{ active?: boolean }>`
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.5rem;
  
  button {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 1rem;
    border: none;
    background-color: ${props => props.active ? props.theme.colors.primary : 'white'};
    color: ${props => props.active ? 'white' : '#000000'};
    font-size: 0.95rem;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s ease;
    box-shadow: ${props => props.theme.shadows.small};
    
    &:hover {
      background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.primaryLight};
    }
    
    svg {
      margin-right: 0.75rem;
      width: 20px;
      height: 20px;
      fill: ${props => props.active ? 'white' : '#000000'};
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #000000;
`;

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

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  color: #000000;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryLight};
  }
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
  align-self: flex-start;
  
  &:hover {
    background-color: #b01624;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const DangerButton = styled(Button)`
  background-color: #dc3545;
  
  &:hover {
    background-color: #c82333;
  }
`;

const UserListTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #000000;
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    color: #000000;
  }
  
  th {
    font-weight: 600;
    color: #000000;
    background-color: ${props => props.theme.colors.primaryLight};
  }
  
  tr:hover {
    background-color: #f8f9fa;
  }
`;

const ActionButton = styled.button`
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  font-size: 0.85rem;
  cursor: pointer;
  margin-right: 1rem;
  
  &:hover {
    background-color: #b01624;
  }
  
  &.ban {
    background-color: #dc3545;
    
    &:hover {
      background-color: #c82333;
    }
  }
  
  &.view {
    background-color: #17a2b8;
    
    &:hover {
      background-color: #138496;
    }
  }
`;

const CartButton = styled(motion.button)`
  position: fixed;
  bottom: 140px;
  right: 30px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  border: none;
  box-shadow: ${props => props.theme.shadows.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  
  svg {
    width: 28px;
    height: 28px;
    fill: white;
  }
  
  &:hover {
    transform: scale(1.1);
  }
`;

// Main component
const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('privacy');
  const [userEmail, setUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Placeholder user data for admin section
  const [users, setUsers] = useState([
    { email: 'john.doe@northeastern.edu', username: 'johndoe', verified: true, banned: false },
    { email: 'jane.doe@northeastern.edu', username: 'janedoe', verified: true, banned: false },
    { email: 'banned.user@northeastern.edu', username: 'banneduser', verified: true, banned: true }
  ]);
  
  // Placeholder form data
  const [accountForm, setAccountForm] = useState({
    username: '',
    email: '',
    phone: '',
    bio: ''
  });
  
  // Placeholder report data
  const [reports, setReports] = useState([
    { id: 1, type: 'User', reporter: 'alice@northeastern.edu', reported: 'baduser@northeastern.edu', reason: 'Spam messages', status: 'Pending' },
    { id: 2, type: 'Listing', reporter: 'bob@northeastern.edu', reported: 'Product: Xbox Controller', reason: 'Misleading description', status: 'Resolved' }
  ]);
  
  // Load user data on mount
  useEffect(() => {
    const email = sessionStorage.getItem('email');
    if (email) {
      setUserEmail(email);
      // Check if the user is the developer account
      setIsAdmin(email === 'studentunimart@gmail.com');
      
      // Pre-fill form with user data
      setAccountForm({
        username: sessionStorage.getItem('username') || '',
        email: email,
        phone: sessionStorage.getItem('phoneNumber') || '',
        bio: sessionStorage.getItem('description') || ''
      });
    } else {
      // Redirect to login if not authenticated
      navigate('/');
    }
  }, [navigate]);
  
  const handleLogoClick = () => {
    navigate('/huskymart');
  };
  
  // Form handlers
  const handleAccountFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAccountForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAccountFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Save to session storage
      sessionStorage.setItem('username', accountForm.username);
      sessionStorage.setItem('phoneNumber', accountForm.phone);
      sessionStorage.setItem('description', accountForm.bio);
      
      // Show success message
      alert('Account settings updated successfully');
      setIsLoading(false);
    }, 1000);
  };
  
  const handleDeleteAccount = () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    
    if (confirmed) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        // Clear session storage and redirect to home
        sessionStorage.clear();
        navigate('/');
      }, 1000);
    }
  };
  
  // Admin action handlers
  const handleBanUser = (email: string) => {
    const confirmed = window.confirm(`Are you sure you want to ban ${email}?`);
    
    if (confirmed) {
      // Update UI immediately for responsive feel
      setUsers(prev => prev.map(user => 
        user.email === email ? { ...user, banned: true } : user
      ));
      
      // In a real app, you would make an API call here
      alert(`User ${email} has been banned.`);
    }
  };
  
  const handleUnbanUser = (email: string) => {
    const confirmed = window.confirm(`Are you sure you want to unban ${email}?`);
    
    if (confirmed) {
      // Update UI immediately for responsive feel
      setUsers(prev => prev.map(user => 
        user.email === email ? { ...user, banned: false } : user
      ));
      
      // In a real app, you would make an API call here
      alert(`User ${email} has been unbanned.`);
    }
  };
  
  // Render helpers
  const renderPrivacySettings = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
        </CardHeader>
        <CardBody>
          <PrivacyText>Update your privacy preferences here.</PrivacyText>
          <DangerButton onClick={handleDeleteAccount} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Delete Account'}
          </DangerButton>
        </CardBody>
      </Card>
    );
  };
  
  const renderAdminUserControls = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardBody>
          <UserListTable>
            <thead>
              <tr>
                <th>Email</th>
                <th>Username</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.email}>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{user.banned ? 'Banned' : 'Active'}</td>
                  <td>
                    <ActionButton className="view" onClick={() => navigate(`/profile/${user.username}`)}>
                      View
                    </ActionButton>
                    {user.banned ? (
                      <ActionButton onClick={() => handleUnbanUser(user.email)}>
                        Unban
                      </ActionButton>
                    ) : (
                      <ActionButton className="ban" onClick={() => handleBanUser(user.email)}>
                        Ban
                      </ActionButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </UserListTable>
        </CardBody>
      </Card>
    );
  };
  
  const renderReportManagement = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Report Management</CardTitle>
        </CardHeader>
        <CardBody>
          <UserListTable>
            <thead>
              <tr>
                <th>Type</th>
                <th>Reporter</th>
                <th>Reported</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id}>
                  <td>{report.type}</td>
                  <td>{report.reporter}</td>
                  <td>{report.reported}</td>
                  <td>{report.reason}</td>
                  <td>{report.status}</td>
                  <td>
                    <ActionButton className="view">
                      View
                    </ActionButton>
                    {report.status === 'Pending' && (
                      <ActionButton>
                        Resolve
                      </ActionButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </UserListTable>
        </CardBody>
      </Card>
    );
  };
  
  return (
    <Container>
      <Header>
        <LogoContainer onClick={handleLogoClick}>
          <HeaderTitle><span className="uni">Uni</span><span className="mart">Mart</span></HeaderTitle>
        </LogoContainer>
      </Header>
      
      <Main>
        <Sidebar>
          <SidebarMenu>
            <SidebarMenuItem active={activeSection === 'privacy'}>
              <button onClick={() => setActiveSection('privacy')}>
                <svg viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
                Privacy & Security
              </button>
            </SidebarMenuItem>
            
            {isAdmin && (
              <>
                <SidebarMenuItem active={activeSection === 'users'}>
                  <button onClick={() => setActiveSection('users')}>
                    <svg viewBox="0 0 24 24">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                    User Management
                  </button>
                </SidebarMenuItem>
                <SidebarMenuItem active={activeSection === 'reports'}>
                  <button onClick={() => setActiveSection('reports')}>
                    <svg viewBox="0 0 24 24">
                      <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>
                    </svg>
                    Report Management
                  </button>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>
        </Sidebar>
        
        <Content>
          {activeSection === 'privacy' && renderPrivacySettings()}
          {isAdmin && activeSection === 'users' && renderAdminUserControls()}
          {isAdmin && activeSection === 'reports' && renderReportManagement()}
        </Content>
      </Main>
    </Container>
  );
};

export default SettingsPage; 