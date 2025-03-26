import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Input from '../components/Input';

// Theme from HuskyMartPage to maintain consistency
const huskyTheme = {
  colors: {
    primary: '#D41B2C', // Northeastern Red
    secondary: '#000000', // Black
    accent: '#D41B2C', // Updated to match primary Northeastern Red
    background: '#FFFFFF', // White background
    cardBackground: '#FFFFFF', // White
    card: '#FFFFFF', 
    text: '#000000', // Black
    lightText: '#666666', // Gray
    border: '#DDDDDD',
    error: '#D41B2C', // Updated to match Northeastern Red
    success: '#28A745',
    inputBackground: '#FFFFFF',
    primaryLight: 'rgba(212, 27, 44, 0.1)', // Transparent Red
    teal: '#00BFB3', // Teal color
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
  
  .uni {
    color: white;
  }
  
  .mart {
    color: ${props => props.theme.colors.primary};
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.text};
  text-align: center;
`;

const FormContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadows.medium};
  padding: 2rem;
`;

const FormRow = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const FormGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryLight};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryLight};
  }
`;

const FileInput = styled.div`
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease;
  color: ${props => props.theme.colors.text};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
  
  input {
    display: none;
  }
`;

const UploadIcon = styled.div`
  margin-bottom: 1rem;
  
  svg {
    width: 48px;
    height: 48px;
    fill: ${props => props.theme.colors.lightText};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
`;

const ImagePreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`;

const ImagePreview = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

const Footer = styled.footer`
  background-color: ${props => props.theme.colors.headerBg};
  color: white;
  padding: 1.5rem;
  text-align: center;
  margin-top: 2rem;
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 0.9rem;
`;

interface AddItemForm {
  title: string;
  price: string;
  category: string;
  condition: string;
  description: string;
  images: File[];
}

const ListYourItemPage: React.FC = () => {
  const [formData, setFormData] = useState<AddItemForm>({
    title: '',
    price: '',
    category: '',
    condition: 'New',
    description: '',
    images: []
  });
  
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
  }, [navigate]);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Limit to 5 images
      const newImages = [...formData.images, ...filesArray].slice(0, 5);
      setFormData(prev => ({ ...prev, images: newImages }));
      
      // Create preview URLs
      const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
      
      // Clean up old preview URLs
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      
      setPreviewUrls(newPreviewUrls);
    }
  };
  
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemoveImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({ ...prev, images: newImages }));
    
    // Update preview URLs
    const newPreviewUrls = [...previewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]);
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };
  
  const handleSubmitItem = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting item:', formData);
    // Here you would normally send the data to your backend
    
    // Show success message and redirect
    alert('Your item has been listed!');
    navigate('/huskymart');
  };

  const handleCancel = () => {
    // Clean up preview URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    navigate('/huskymart');
  };

  return (
    <ThemeProvider theme={huskyTheme}>
      <Container>
        <Header>
          <LogoContainer onClick={handleLogoClick}>
            <CartIcon viewBox="0 0 24 24">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </CartIcon>
            <CartTooltip>Back to homepage</CartTooltip>
            <HeaderTitle><span className="uni">Uni</span><span className="mart">Mart</span></HeaderTitle>
          </LogoContainer>
        </Header>
        
        <MainContent>
          <PageTitle>List Your Item</PageTitle>
          
          <FormContainer>
            <form onSubmit={handleSubmitItem}>
              <FormRow>
                <FormLabel htmlFor="title">Item Title</FormLabel>
                <Input
                  id="title"
                  name="title"
                  placeholder="What are you selling?"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </FormRow>
              
              <FormGroup>
                <FormRow>
                  <FormLabel htmlFor="price">Price ($)</FormLabel>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                  <small style={{ marginTop: '0.25rem', display: 'block', color: '#666' }}>
                    Enter the price without currency symbol
                  </small>
                </FormRow>
                
                <FormRow>
                  <FormLabel htmlFor="category">Category</FormLabel>
                  <Select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    <option value="Academics">Academics</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Housing">Housing</option>
                    <option value="Free Items">Free Items</option>
                  </Select>
                </FormRow>
              </FormGroup>
              
              <FormRow>
                <FormLabel htmlFor="condition">Condition</FormLabel>
                <Select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                >
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </Select>
              </FormRow>
              
              <FormRow>
                <FormLabel htmlFor="description">Description</FormLabel>
                <TextArea
                  id="description"
                  name="description"
                  placeholder="Describe your item in detail..."
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </FormRow>
              
              <FormRow>
                <FormLabel>Photos</FormLabel>
                <FileInput onClick={handleFileUploadClick}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                  />
                  <UploadIcon>
                    <svg viewBox="0 0 24 24">
                      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                    </svg>
                  </UploadIcon>
                  {formData.images.length > 0 ? (
                    <p>{formData.images.length} file(s) selected</p>
                  ) : (
                    <p>Click to upload photos (max 5)</p>
                  )}
                </FileInput>
                
                {previewUrls.length > 0 && (
                  <ImagePreviewContainer>
                    {previewUrls.map((url, index) => (
                      <ImagePreview key={index}>
                        <img src={url} alt={`Preview ${index + 1}`} />
                        <RemoveImageButton onClick={() => handleRemoveImage(index)}>
                          ×
                        </RemoveImageButton>
                      </ImagePreview>
                    ))}
                  </ImagePreviewContainer>
                )}
              </FormRow>
              
              <ButtonGroup>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  type="button"
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  List Item
                </Button>
              </ButtonGroup>
            </form>
          </FormContainer>
        </MainContent>
        
        <Footer>
          <FooterText>© {new Date().getFullYear()} Northeastern University Marketplace - All Rights Reserved</FooterText>
        </Footer>
      </Container>
    </ThemeProvider>
  );
};

export default ListYourItemPage; 