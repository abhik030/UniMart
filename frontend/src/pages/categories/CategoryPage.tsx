import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { motion } from 'framer-motion';
import Button from '../../components/Button';
import Input from '../../components/Input';

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

// Interface for product items
interface Product {
  id: number;
  title: string;
  price: number;
  seller: string;
  time: string;
  image?: string;
  condition?: string;
  subcategory?: string;
  course_number?: string;
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
  padding: 0.6rem 2rem;
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
  border-radius: 30px;
  border: 2px solid transparent;
  background-color: white;
  color: ${props => props.theme.colors.text};
  font-size: 1.1rem;
  outline: none !important;
  transition: transform 0.2s ease, border-color 0.2s ease;
  
  &::placeholder {
    color: #999;
  }
  
  &:focus {
    outline: none !important;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: none;
    transform: scale(1.02);
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
  position: relative;
`;

// Forward declaration to resolve circular reference
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

const ContentWrapper = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

// Replaced ContentWrapper with a flex layout
const PageLayout = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 2rem;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  width: 280px;
  flex-shrink: 0;
  color: ${props => props.theme.colors.text};
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const MainContent = styled.main`
  flex-grow: 1;
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CategoryTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: ${props => props.theme.colors.text};
`;

// Updated FilterBar to be simpler since filters are now in sidebar
const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0.5rem;
  color: ${props => props.theme.colors.text};
  
  @media (max-width: 768px) {
    width: 100%;
    margin: 0.5rem 0;
  }
`;

const FilterLabel = styled.span`
  font-weight: 600;
  color: black;
  text-shadow: none;
`;

const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: white;
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.small};
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primaryLight};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryLight};
  }
  
  option {
    background-color: white;
    color: ${props => props.theme.colors.text};
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
`;

const ProductCard = styled(motion.div)`
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.small};
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const ProductImage = styled.div`
  height: 180px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #999;
  position: relative;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductInfo = styled.div`
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: ${props => props.theme.colors.text};
`;

const ProductPrice = styled.div`
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.primary};
`;

const ProductSeller = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 0.25rem;
`;

const ProductTime = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.lightText};
  margin-top: auto;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  grid-column: 1 / -1;
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.border};
`;

const EmptyStateText = styled.h3`
  font-size: 1.5rem;
  margin: 0 0 1rem;
  color: ${props => props.theme.colors.text};
`;

const EmptyStateDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.lightText};
  max-width: 500px;
  margin: 0 auto;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 0.5rem;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.primaryLight};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Component for filter sections in sidebar
const FilterSection = styled.div`
  margin-bottom: 1.5rem;
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
  padding: 1.25rem;
  color: ${props => props.theme.colors.text};
`;

const FilterSectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
`;

const FilterOptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FilterCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
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

const PriceRangeInputs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const PriceInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ConditionBadge = styled.span<{ condition: string | undefined }>`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 0.75rem;
  font-weight: 600;
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

// Updated styling for condition select to match other inputs
const ConditionSelect = styled.select`
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: white;
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  option {
    background-color: white;
    color: ${props => props.theme.colors.text};
  }
`;

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

// Sample data for different categories
const mockCategoryData: Record<string, Product[]> = {
  'textbooks': [
    { id: 1, title: 'Textbook Item 1', price: 0, seller: 'Seller Name', time: '1 day ago', condition: 'Good', subcategory: 'physical', course_number: 'CS2800' },
  ],
  'electronics': [
    { id: 1, title: 'Electronics Item 1', price: 0, seller: 'Seller Name', time: '1 day ago', condition: 'New', subcategory: 'laptops' },
  ],
  'furniture': [
    { id: 1, title: 'Furniture Item 1', price: 0, seller: 'Seller Name', time: '1 day ago', condition: 'Good', subcategory: 'chairs' },
  ],
  'apparel': [
    { id: 1, title: 'Apparel Item 1', price: 0, seller: 'Seller Name', time: '1 day ago', condition: 'New', subcategory: 'shirts' },
  ],
  'transportation': [
    { id: 1, title: 'Transportation Item 1', price: 0, seller: 'Seller Name', time: '1 day ago', condition: 'Good', subcategory: 'bikes' },
  ],
  'housing': [
    { id: 1, title: 'Housing Item 1', price: 0, seller: 'Seller Name', time: '1 day ago', condition: 'Good', subcategory: 'apartment' },
  ],
  'entertainment': [
    { id: 1, title: 'Entertainment Item 1', price: 0, seller: 'Seller Name', time: '1 day ago', condition: 'Good', subcategory: 'games' },
  ],
  'free_items': [
    { id: 1, title: 'Free Item 1', price: 0, seller: 'Seller Name', time: '1 day ago', condition: 'Good', subcategory: 'misc' },
  ],
};

// Main component
const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSort, setFilterSort] = useState('newest');
  const [priceRange, setPriceRange] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showNotifications, setShowNotifications] = useState(false);
  const itemsPerPage = 8;
  
  const formattedCategory = category ? category.replace(/-/g, ' ') : '';
  const capitalizedCategory = formattedCategory
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Handle navigation
  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/shopping-cart');
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleNotificationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleNotifications();
  };

  const handleLogoClick = () => {
    navigate('/huskymart');
  };

  const handleMessagesClick = () => {
    navigate('/messages');
  };

  const openContactModal = () => {
    // This would typically open a contact modal
    alert("Contact modal would open here");
  };
  
  // Handle search and filters
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality would be implemented here
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterSort(e.target.value);
    setCurrentPage(1);
  };
  
  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCondition(e.target.value);
    setCurrentPage(1);
  };
  
  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategories(prev => {
      if (prev.includes(subcategory)) {
        return prev.filter(s => s !== subcategory);
      } else {
        return [...prev, subcategory];
      }
    });
    setCurrentPage(1);
  };
  
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(e.target.value);
    setCurrentPage(1);
  };
  
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(e.target.value);
    setCurrentPage(1);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Get subcategories based on category
  const getSubcategories = () => {
    switch (category) {
      case 'textbooks':
        return [
          { id: 'physical', name: 'Physical Books' },
          { id: 'ebook', name: 'E-Books' }
        ];
      case 'electronics':
        return [
          { id: 'phones', name: 'Phones & Accessories' },
          { id: 'laptops', name: 'Laptops & Computers' },
          { id: 'headphones', name: 'Headphones & Audio' },
          { id: 'tablets', name: 'Tablets & E-readers' },
          { id: 'gaming', name: 'Gaming Equipment' }
        ];
      case 'furniture':
        return [
          { id: 'chairs', name: 'Chairs' },
          { id: 'desks', name: 'Desks' },
          { id: 'tables', name: 'Tables' },
          { id: 'sofas', name: 'Sofas & Couches' },
          { id: 'beds', name: 'Beds & Mattresses' }
        ];
      case 'apparel':
        return [
          { id: 'shirts', name: 'Shirts & Tops' },
          { id: 'pants', name: 'Pants & Bottoms' },
          { id: 'dresses', name: 'Dresses & Skirts' },
          { id: 'outerwear', name: 'Jackets & Outerwear' },
          { id: 'footwear', name: 'Shoes & Footwear' }
        ];
      case 'transportation':
        return [
          { id: 'bikes', name: 'Bicycles' },
          { id: 'scooters', name: 'Scooters' },
          { id: 'skateboards', name: 'Skateboards' },
          { id: 'car', name: 'Car Accessories' }
        ];
      case 'housing':
        return [
          { id: 'apartment', name: 'Apartment' },
          { id: 'house', name: 'House' },
          { id: 'room', name: 'Room' },
          { id: 'studio', name: 'Studio' }
        ];
      default:
        return [];
    }
  };
  
  // Get category-specific filters
  const getCategorySpecificFilters = () => {
    switch (category) {
      case 'apparel':
        return (
          <FilterSection>
            <FilterSectionTitle>Gender</FilterSectionTitle>
            <FilterOptionGroup>
              <FilterCheckboxLabel style={{ color: huskyTheme.colors.text }}>
                <FilterCheckbox type="checkbox" /> Male
              </FilterCheckboxLabel>
              <FilterCheckboxLabel style={{ color: huskyTheme.colors.text }}>
                <FilterCheckbox type="checkbox" /> Female
              </FilterCheckboxLabel>
              <FilterCheckboxLabel style={{ color: huskyTheme.colors.text }}>
                <FilterCheckbox type="checkbox" /> Unisex
              </FilterCheckboxLabel>
            </FilterOptionGroup>
          </FilterSection>
        );
      case 'housing':
        return (
          <>
            <FilterSection>
              <FilterSectionTitle>Sublet Period</FilterSectionTitle>
              <FilterOptionGroup>
                <FilterCheckboxLabel style={{ color: huskyTheme.colors.text }}>
                  <FilterCheckbox type="checkbox" /> Fall Semester
                </FilterCheckboxLabel>
                <FilterCheckboxLabel style={{ color: huskyTheme.colors.text }}>
                  <FilterCheckbox type="checkbox" /> Spring Semester
                </FilterCheckboxLabel>
                <FilterCheckboxLabel style={{ color: huskyTheme.colors.text }}>
                  <FilterCheckbox type="checkbox" /> Summer 1
                </FilterCheckboxLabel>
                <FilterCheckboxLabel style={{ color: huskyTheme.colors.text }}>
                  <FilterCheckbox type="checkbox" /> Summer 2
                </FilterCheckboxLabel>
                <FilterCheckboxLabel style={{ color: huskyTheme.colors.text }}>
                  <FilterCheckbox type="checkbox" /> Full Year
                </FilterCheckboxLabel>
              </FilterOptionGroup>
            </FilterSection>
            <FilterSection>
              <FilterSectionTitle>Bathroom Type</FilterSectionTitle>
              <FilterOptionGroup>
                <FilterCheckboxLabel style={{ color: huskyTheme.colors.text }}>
                  <FilterCheckbox type="checkbox" /> Private
                </FilterCheckboxLabel>
                <FilterCheckboxLabel style={{ color: huskyTheme.colors.text }}>
                  <FilterCheckbox type="checkbox" /> Shared
                </FilterCheckboxLabel>
              </FilterOptionGroup>
            </FilterSection>
            <FilterSection>
              <FilterSectionTitle>Utilities</FilterSectionTitle>
              <FilterOptionGroup>
                <FilterCheckboxLabel style={{ color: huskyTheme.colors.text }}>
                  <FilterCheckbox type="checkbox" /> Included
                </FilterCheckboxLabel>
                <FilterCheckboxLabel style={{ color: huskyTheme.colors.text }}>
                  <FilterCheckbox type="checkbox" /> Not Included
                </FilterCheckboxLabel>
              </FilterOptionGroup>
            </FilterSection>
          </>
        );
      default:
        return null;
    }
  };
  
  // Load and filter products
  useEffect(() => {
    const loadProducts = () => {
      // Convert category param to the format used in our mock data
      const categoryKey = category ? category.toLowerCase().replace(/-/g, '') : '';
      
      // Get products for this category or empty array if not found
      let products = mockCategoryData[categoryKey] || [];
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        products = products.filter(
          product => 
            product.title.toLowerCase().includes(query) || 
            // Also search in course_number for textbooks
            (categoryKey === 'textbooks' && 
             product.course_number?.toLowerCase().includes(query))
        );
      }
      
      // Filter by custom price range
      if (minPrice || maxPrice) {
        products = products.filter(product => {
          const min = minPrice ? parseFloat(minPrice) : 0;
          const max = maxPrice ? parseFloat(maxPrice) : Infinity;
          return product.price >= min && product.price <= max;
        });
      }
      // Filter by preset price range if custom range not set
      else if (priceRange !== 'all') {
        switch (priceRange) {
          case 'under25':
            products = products.filter(product => product.price < 25);
            break;
          case '25to50':
            products = products.filter(product => product.price >= 25 && product.price <= 50);
            break;
          case '50to100':
            products = products.filter(product => product.price > 50 && product.price <= 100);
            break;
          case 'over100':
            products = products.filter(product => product.price > 100);
            break;
        }
      }
      
      // Filter by condition (in a real app, products would have a condition property)
      if (selectedCondition !== 'all') {
        products = products.filter(product => product.condition === selectedCondition);
      }
      
      // Filter by subcategory
      if (selectedSubcategories.length > 0) {
        products = products.filter(product => 
          product.subcategory !== undefined && 
          selectedSubcategories.includes(product.subcategory)
        );
      }
      
      // Sort products
      switch (filterSort) {
        case 'priceAsc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'priceDesc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          // For demo purposes, we're just using the ordering in the array
          // In a real app, you'd sort by date
          break;
        case 'popular':
          // For demo purposes, this is a random sort
          // In a real app, you'd sort by view count or popularity metric
          products.sort(() => Math.random() - 0.5);
          break;
      }
      
      // Calculate total pages
      setTotalPages(Math.ceil(products.length / itemsPerPage));
      
      // Paginate results
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);
      
      setFilteredProducts(paginatedProducts);
    };
    
    loadProducts();
  }, [category, searchQuery, filterSort, priceRange, minPrice, maxPrice, selectedCondition, selectedSubcategories, currentPage]);
  
  // Add a helper function to render the condition badge
  const renderProductConditionBadge = (condition: string | undefined) => {
    if (!condition) return null;
    
    return (
      <ConditionBadge condition={condition}>
        {condition}
      </ConditionBadge>
    );
  };

  // Add a handler for product card click
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  // In CategoryPage component, add a handler for "See All Notifications"
  const handleSeeAllNotifications = () => {
    console.log('Navigating to all notifications page');
    setShowNotifications(false);
  };

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
          
          <SearchContainer>
            <form onSubmit={handleSearchSubmit}>
              <SearchBar>
                <SearchInput 
                  type="text"
                  placeholder={`Search products in ${capitalizedCategory}`}
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
                style={{ position: 'absolute', top: '100%', right: '0' }}
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
            
            <IconButton title="Shopping Cart" onClick={handleCartClick}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              <IconTooltip>Shopping Cart</IconTooltip>
            </IconButton>
          </HeaderActions>
        </Header>
        
        <PageLayout>
          <Sidebar style={{ marginTop: '6rem' }}>
            <FilterSection>
              <FilterSectionTitle>Product Type</FilterSectionTitle>
              <FilterOptionGroup>
                {getSubcategories().map(subcategory => (
                  <FilterCheckboxLabel 
                    key={subcategory.id}
                    style={{ color: huskyTheme.colors.text }}
                  >
                    <FilterCheckbox 
                      type="checkbox" 
                      checked={selectedSubcategories.includes(subcategory.id)}
                      onChange={() => handleSubcategoryChange(subcategory.id)}
                    />
                    {subcategory.name}
                  </FilterCheckboxLabel>
                ))}
              </FilterOptionGroup>
            </FilterSection>
            
            <FilterSection>
              <FilterSectionTitle>Price Range</FilterSectionTitle>
              <PriceRangeInputs>
                <PriceInput 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice}
                  onChange={handleMinPriceChange}
                />
                <span style={{ color: huskyTheme.colors.text }}>-</span>
                <PriceInput 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                />
              </PriceRangeInputs>
            </FilterSection>
            
            <FilterSection>
              <FilterSectionTitle>Condition</FilterSectionTitle>
              <ConditionSelect 
                value={selectedCondition} 
                onChange={handleConditionChange}
                style={{ marginTop: '0.5rem' }}
              >
                <option value="all">Any Condition</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </ConditionSelect>
            </FilterSection>
            
            {getCategorySpecificFilters()}
          </Sidebar>
          
          <MainContent>
            <CategoryHeader>
              <CategoryTitle>{capitalizedCategory}</CategoryTitle>
            </CategoryHeader>
            
            <FilterBar>
              <FilterGroup>
                <FilterLabel>Sort by:</FilterLabel>
                <FilterSelect value={filterSort} onChange={handleSortChange}>
                  <option value="newest">Newest</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </FilterSelect>
              </FilterGroup>
            </FilterBar>
            
            <ProductsGrid>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ 
                      y: -5, 
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                      border: `1px solid ${huskyTheme.colors.primary}` 
                    }}
                    onClick={() => handleProductClick(product.id)}
                  >
                    <ProductImage>
                      {product.image ? (
                        <img src={product.image} alt={product.title} />
                      ) : (
                        <span>No Image</span>
                      )}
                      {renderProductConditionBadge(product.condition)}
                    </ProductImage>
                    <ProductInfo>
                      <ProductName>{product.title}</ProductName>
                      <ProductPrice>${product.price}</ProductPrice>
                      <ProductSeller>Seller: {product.seller}</ProductSeller>
                      <ProductTime>Posted: {product.time}</ProductTime>
                    </ProductInfo>
                  </ProductCard>
                ))
              ) : (
                <EmptyState>
                  <EmptyStateIcon>🔍</EmptyStateIcon>
                  <EmptyStateText>No items found</EmptyStateText>
                  <EmptyStateDescription>
                    Try adjusting your search or filters to find what you're looking for.
                  </EmptyStateDescription>
                </EmptyState>
              )}
            </ProductsGrid>
            
            {totalPages > 1 && (
              <Pagination>
                <PageButton 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1}
                >
                  Previous
                </PageButton>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PageButton
                    key={page}
                    active={page === currentPage}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </PageButton>
                ))}
                
                <PageButton 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                >
                  Next
                </PageButton>
              </Pagination>
            )}
          </MainContent>
        </PageLayout>
      </Container>
    </ThemeProvider>
  );
};

export default CategoryPage; 