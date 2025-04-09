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
  
  .husky {
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
  color: ${props => props.theme.colors.text};
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
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryLight};
  }
  
  option {
    background-color: white;
    color: ${props => props.theme.colors.text};
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

const FilterCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 0.25rem;
  color: ${props => props.theme.colors.text};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const FilterCheckbox = styled.input`
  cursor: pointer;
  width: 16px;
  height: 16px;
  
  &:checked {
    accent-color: ${props => props.theme.colors.primary};
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ToggleLabel = styled.label`
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
`;

const ToggleSwitch = styled.div<{ active: boolean }>`
  position: relative;
  width: 50px;
  height: 24px;
  background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    top: 2px;
    left: ${props => props.active ? '28px' : '2px'};
    transition: left 0.2s ease;
  }
`;

interface AddItemForm {
  title: string;
  price: string;
  category: string;
  subcategory: string;
  condition: string;
  description: string;
  images: File[];
  // Category-specific fields
  brand?: string;
  model?: string;
  size?: string;
  color?: string;
  gender?: string;
  isbn?: string;
  course_number?: string;
  format?: string;
  sublet_period?: string[];
  num_rooms?: string;
  num_bathrooms?: string;
  bathroom_type?: string;
  utilities_included?: boolean;
  utilities_details?: string;
  allowsBidding: boolean;
}

interface CategoryField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'checkbox';
  required: boolean;
  options?: { value: string; label: string }[];
}

const ListYourItemPage: React.FC = () => {
  const [formData, setFormData] = useState<AddItemForm>({
    title: '',
    price: '',
    category: '',
    subcategory: '',
    condition: 'New',
    description: '',
    images: [],
    sublet_period: [],
    allowsBidding: true
  });
  
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Get subcategories based on selected category
  const getSubcategories = () => {
    switch (formData.category) {
      case 'Academics':
        return [
          { value: 'physical', label: 'Physical Book' },
          { value: 'ebook', label: 'E-Book' }
        ];
      case 'Electronics':
        return [
          { value: 'phones', label: 'Phones & Accessories' },
          { value: 'laptops', label: 'Laptops & Computers' },
          { value: 'headphones', label: 'Headphones & Audio' },
          { value: 'tablets', label: 'Tablets & E-readers' },
          { value: 'gaming', label: 'Gaming Equipment' },
          { value: 'cameras', label: 'Cameras & Photography' },
          { value: 'tvs', label: 'TVs & Monitors' },
          { value: 'other_electronics', label: 'Other Electronics' }
        ];
      case 'Furniture':
        return [
          { value: 'chairs', label: 'Chairs' },
          { value: 'desks', label: 'Desks' },
          { value: 'tables', label: 'Tables' },
          { value: 'sofas', label: 'Sofas & Couches' },
          { value: 'beds', label: 'Beds & Mattresses' },
          { value: 'shelves', label: 'Shelves & Storage' },
          { value: 'dining', label: 'Dining Furniture' },
          { value: 'other_furniture', label: 'Other Furniture' }
        ];
      case 'Apparel':
        return [
          { value: 'shirts', label: 'Shirts & Tops' },
          { value: 'pants', label: 'Pants & Bottoms' },
          { value: 'dresses', label: 'Dresses & Skirts' },
          { value: 'outerwear', label: 'Jackets & Outerwear' },
          { value: 'footwear', label: 'Shoes & Footwear' },
          { value: 'accessories', label: 'Accessories' },
          { value: 'formal', label: 'Formal Wear' },
          { value: 'athletic', label: 'Athletic Wear' },
          { value: 'other_apparel', label: 'Other Apparel' }
        ];
      case 'Transportation':
        return [
          { value: 'bikes', label: 'Bicycles' },
          { value: 'scooters', label: 'Scooters' },
          { value: 'skateboards', label: 'Skateboards' },
          { value: 'skates', label: 'Skates & Rollerblades' },
          { value: 'car_accessories', label: 'Car Accessories' },
          { value: 'other_transportation', label: 'Other Transportation' }
        ];
      case 'Housing':
        return [
          { value: 'apartment', label: 'Apartment' },
          { value: 'house', label: 'House' },
          { value: 'room', label: 'Room' },
          { value: 'studio', label: 'Studio' }
        ];
      default:
        return [];
    }
  };

  // Get category-specific fields
  const getCategorySpecificFields = (): CategoryField[] => {
    switch (formData.category) {
      case 'Academics':
        return [
          { name: 'isbn', label: 'ISBN', type: 'text' as const, required: false },
          { 
            name: 'course_number', 
            label: 'Course Number', 
            type: 'text' as const, 
            required: false 
          },
          ...(formData.subcategory === 'physical' ? [
            { 
              name: 'format', 
              label: 'Format', 
              type: 'select' as const, 
              required: false,
              options: [
                { value: 'hardcover', label: 'Hardcover' },
                { value: 'paperback', label: 'Paperback' },
                { value: 'spiral', label: 'Spiral-bound' },
                { value: 'looseleaf', label: 'Loose-leaf' }
              ]
            }
          ] : [])
        ];
      case 'Electronics':
        return [
          { name: 'brand', label: 'Brand', type: 'text' as const, required: true },
          { name: 'model', label: 'Model', type: 'text' as const, required: false }
        ];
      case 'Apparel':
        return [
          { 
            name: 'gender', 
            label: 'Gender', 
            type: 'select' as const, 
            required: true,
            options: [
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'unisex', label: 'Unisex' }
            ]
          },
          { name: 'size', label: 'Size', type: 'text' as const, required: true },
          { name: 'color', label: 'Color', type: 'text' as const, required: false },
          { name: 'brand', label: 'Brand', type: 'text' as const, required: false }
        ];
      case 'Housing':
        return [
          { 
            name: 'sublet_period', 
            label: 'Sublet Period', 
            type: 'multiselect' as const, 
            required: true,
            options: [
              { value: 'fall', label: 'Fall Semester' },
              { value: 'spring', label: 'Spring Semester' },
              { value: 'summer1', label: 'Summer 1' },
              { value: 'summer2', label: 'Summer 2' },
              { value: 'full_year', label: 'Full Year' }
            ]
          },
          { name: 'num_rooms', label: 'Number of Rooms', type: 'number' as const, required: true },
          { name: 'num_bathrooms', label: 'Number of Bathrooms', type: 'number' as const, required: true },
          { 
            name: 'bathroom_type', 
            label: 'Bathroom Type', 
            type: 'select' as const, 
            required: true,
            options: [
              { value: 'private', label: 'Private' },
              { value: 'shared', label: 'Shared' }
            ]
          },
          { name: 'utilities_included', label: 'Utilities Included', type: 'checkbox' as const, required: true },
          { name: 'utilities_details', label: 'Utilities Details', type: 'text' as const, required: false }
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
  }, [navigate]);

  // Reset subcategory when category changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, subcategory: '' }));
  }, [formData.category]);

  const handleLogoClick = () => {
    navigate('/huskymart');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleMultiselectChange = (name: string, value: string) => {
    setFormData(prev => {
      const currentValues = prev[name as keyof AddItemForm] as string[] || [];
      
      // Toggle the value
      if (currentValues.includes(value)) {
        return { 
          ...prev, 
          [name]: currentValues.filter(v => v !== value) 
        };
      } else {
        return { 
          ...prev, 
          [name]: [...currentValues, value] 
        };
      }
    });
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

  const handleToggleBidding = () => {
    setFormData(prev => ({
      ...prev,
      allowsBidding: !prev.allowsBidding
    }));
  };

  // Render a specific field based on its type
  const renderField = (field: CategoryField) => {
    switch (field.type) {
      case 'text':
        return (
          <FormRow key={field.name}>
            <FormLabel htmlFor={field.name}>
              {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
              {field.name === 'course_number' && (
                <span style={{ fontSize: '0.8rem', marginLeft: '0.5rem', color: '#666' }}>
                  (Don't add a space between the department and class number. Ex. CS1200)
                </span>
              )}
            </FormLabel>
            <Input
              id={field.name}
              name={field.name}
              value={formData[field.name as keyof AddItemForm] as string || ''}
              onChange={handleInputChange}
              required={field.required}
            />
          </FormRow>
        );
        
      case 'number':
        return (
          <FormRow key={field.name}>
            <FormLabel htmlFor={field.name}>
              {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
            </FormLabel>
            <Input
              id={field.name}
              name={field.name}
              type="number"
              min="0"
              value={formData[field.name as keyof AddItemForm] as string || ''}
              onChange={handleInputChange}
              required={field.required}
            />
          </FormRow>
        );
        
      case 'select':
        return (
          <FormRow key={field.name}>
            <FormLabel htmlFor={field.name}>
              {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
            </FormLabel>
            <Select
              id={field.name}
              name={field.name}
              value={formData[field.name as keyof AddItemForm] as string || ''}
              onChange={handleInputChange}
              required={field.required}
            >
              <option value="" disabled>Select {field.label}</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
          </FormRow>
        );
        
      case 'multiselect':
        return (
          <FormRow key={field.name}>
            <FormLabel>
              {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
            </FormLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {field.options?.map(option => {
                const values = formData[field.name as keyof AddItemForm] as string[] || [];
                return (
                  <FilterCheckboxLabel key={option.value}>
                    <FilterCheckbox
                      type="checkbox"
                      checked={values.includes(option.value)}
                      onChange={() => handleMultiselectChange(field.name, option.value)}
                    />
                    {option.label}
                  </FilterCheckboxLabel>
                );
              })}
            </div>
          </FormRow>
        );
        
      case 'checkbox':
        return (
          <FormRow key={field.name}>
            <FilterCheckboxLabel>
              <FilterCheckbox
                type="checkbox"
                name={field.name}
                checked={!!formData[field.name as keyof AddItemForm]}
                onChange={handleCheckboxChange}
              />
              {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
            </FilterCheckboxLabel>
          </FormRow>
        );
        
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={huskyTheme}>
      <Container>
        <Header>
          <LogoContainer onClick={handleLogoClick}>
            <CartIcon viewBox="0 0 24 24">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </CartIcon>
            <CartTooltip>UniMart Home</CartTooltip>
            <HeaderTitle onClick={() => navigate('/huskymart')}><span className="husky">Husky</span><span className="mart">Mart</span></HeaderTitle>
          </LogoContainer>
        </Header>
        
        <MainContent>
          <PageTitle>List Your Item</PageTitle>
          
          <FormContainer>
            <form onSubmit={handleSubmitItem}>
              <FormRow>
                <FormLabel htmlFor="title">Item Title <span style={{ color: 'red' }}>*</span></FormLabel>
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
                  <FormLabel htmlFor="price">Price ($) <span style={{ color: 'red' }}>*</span></FormLabel>
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
                  <FormLabel htmlFor="category">Category <span style={{ color: 'red' }}>*</span></FormLabel>
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
              
              {formData.category && getSubcategories().length > 0 && (
                <FormRow>
                  <FormLabel htmlFor="subcategory">Subcategory <span style={{ color: 'red' }}>*</span></FormLabel>
                  <Select
                    id="subcategory"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>Select a subcategory</option>
                    {getSubcategories().map(subcategory => (
                      <option key={subcategory.value} value={subcategory.value}>
                        {subcategory.label}
                      </option>
                    ))}
                  </Select>
                </FormRow>
              )}
              
              <FormRow>
                <FormLabel htmlFor="condition">Condition <span style={{ color: 'red' }}>*</span></FormLabel>
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

              {/* Category-specific fields */}
              {formData.category && getCategorySpecificFields().map(renderField)}
              
              <FormRow>
                <FormLabel htmlFor="description">Description <span style={{ color: 'red' }}>*</span></FormLabel>
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
                <FormLabel>Photos <span style={{ color: 'red' }}>*</span></FormLabel>
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
              
              <FormGroup>
                <ToggleContainer>
                  <ToggleLabel htmlFor="allowsBidding">Allow Bidding</ToggleLabel>
                  <ToggleSwitch
                    active={formData.allowsBidding}
                    onClick={handleToggleBidding}
                    role="switch"
                    aria-checked={formData.allowsBidding}
                  />
                </ToggleContainer>
                <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
                  When enabled, buyers can make offers below your asking price. You can accept, decline, or counter these offers.
                </p>
              </FormGroup>
              
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