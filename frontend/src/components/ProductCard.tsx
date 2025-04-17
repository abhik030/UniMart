import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Card = styled(motion.div)`
  background-color: ${props => props.theme.colors.cardBackground || props.theme.colors.background};
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadows.small};
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
  
  @media (max-width: 768px) {
    height: 160px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const Discount = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 12px;
  z-index: 1;
`;

const BadgeContainer = styled.div`
  display: flex;
  position: absolute;
  bottom: 10px;
  left: 10px;
  gap: 5px;
`;

const Badge = styled.div<{ type?: 'new' | 'hot' | 'sale' }>`
  background-color: ${props => 
    props.type === 'new' ? '#4CAF50' : 
    props.type === 'hot' ? '#FF5722' : 
    props.type === 'sale' ? props.theme.colors.primary : '#757575'};
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 10px;
  text-transform: uppercase;
`;

const ContentContainer = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Title = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Price = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
`;

const CurrentPrice = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const OldPrice = styled.span`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText || '#999'};
  text-decoration: line-through;
`;

const Details = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  color: ${props => props.theme.colors.lightText || '#666'};
  font-size: 0.8rem;
`;

const Condition = styled.span``;

const Seller = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
`;

interface ProductCardProps {
  id: number | string;
  title: string;
  price: number;
  oldPrice?: number;
  image: string;
  condition?: string;
  sellerName?: string;
  discount?: number;
  badges?: Array<'new' | 'hot' | 'sale'>;
  onClick?: (id: number | string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  oldPrice,
  image,
  condition = 'New',
  sellerName,
  discount,
  badges = [],
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  // Format price to 2 decimal places if needed
  const formatPrice = (p: number) => {
    return p % 1 === 0 ? p : p.toFixed(2);
  };

  return (
    <Card 
      onClick={handleClick}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ImageContainer>
        <ProductImage src={image} alt={title} />
        {discount && <Discount>-{discount}%</Discount>}
        {badges.length > 0 && (
          <BadgeContainer>
            {badges.map((badge, index) => (
              <Badge key={index} type={badge}>
                {badge}
              </Badge>
            ))}
          </BadgeContainer>
        )}
      </ImageContainer>
      
      <ContentContainer>
        <Title>{title}</Title>
        
        <Price>
          <CurrentPrice>${formatPrice(price)}</CurrentPrice>
          {oldPrice && <OldPrice>${formatPrice(oldPrice)}</OldPrice>}
        </Price>
        
        <Details>
          <Condition>{condition}</Condition>
          {sellerName && <Seller>by {sellerName}</Seller>}
        </Details>
      </ContentContainer>
    </Card>
  );
};

export default ProductCard; 