import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import Button from '../components/Button';
import groupImage from './GettyImages-1202957911.jpg';
import uniMartPhoto from './PhotoForUniMart.jpg';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 2rem;
  background-color: ${props => props.theme.colors.background};
  position: relative;
  overflow-x: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    opacity: 0.05;
    filter: blur(100px);
    z-index: 0;
  }
  
  &::before {
    top: -100px;
    left: -100px;
    animation: float 15s ease-in-out infinite alternate;
  }
  
  &::after {
    bottom: 20%;
    right: -100px;
    animation: float 20s ease-in-out infinite alternate-reverse;
  }
  
  @keyframes float {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(50px, 50px);
    }
  }
`;

const SideDecoration = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  width: 400px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.15;

  &.left {
    left: 0;
    background: 
      radial-gradient(circle at 0% 50%, ${props => props.theme.colors.primary}30 0%, transparent 50%),
      linear-gradient(
        to right,
        ${props => props.theme.colors.primary}20,
        transparent 80%
      );
    transform: translateX(-20%);
  }

  &.right {
    right: 0;
    background: 
      radial-gradient(circle at 100% 50%, ${props => props.theme.colors.primary}30 0%, transparent 50%),
      linear-gradient(
        to left,
        ${props => props.theme.colors.primary}20,
        transparent 80%
      );
    transform: translateX(20%);
  }

  &::before {
    content: '';
    position: absolute;
    top: 20%;
    width: 100%;
    height: 60%;
    background-image: ${props => props.theme.colors.primary}10;
    filter: blur(50px);
    animation: pulse 8s ease-in-out infinite alternate;
  }

  &.left::before {
    right: -20%;
    transform: skewY(-15deg);
  }

  &.right::before {
    left: -20%;
    transform: skewY(15deg);
  }

  @keyframes pulse {
    0% {
      opacity: 0.3;
      transform: translateY(0) scale(0.9);
    }
    100% {
      opacity: 0.6;
      transform: translateY(50px) scale(1.1);
    }
  }
`;

const FloatingShape = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.1;
  background: ${props => props.theme.colors.primary};
  filter: blur(40px);
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  animation: morph 8s ease-in-out infinite;

  &.shape1 {
    top: 15%;
    left: 5%;
  }

  &.shape2 {
    bottom: 15%;
    right: 5%;
    animation-delay: -4s;
  }

  @keyframes morph {
    0% {
      border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    }
    50% {
      border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
    }
    100% {
      border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    }
  }
`;

const GridPattern = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(${props => props.theme.colors.primary}05 1px, transparent 1px),
    linear-gradient(90deg, ${props => props.theme.colors.primary}05 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.2;
  z-index: 0;
  pointer-events: none;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 4rem;
  position: relative;
  z-index: 10;
  position: sticky;
  top: 0;
  padding: 1rem 0;
  backdrop-filter: blur(5px);
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled.a`
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const Content = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  text-align: center;
  margin-top: 2rem;
  position: relative;
  z-index: 1;
`;

const Title = styled(motion.h1)`
  font-size: 7rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.primary};
  line-height: 1.1;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #2dd4bf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Clash Display', sans-serif;
  text-transform: uppercase;
  transform: skew(-5deg);
  text-shadow: 4px 4px 0px rgba(45, 212, 191, 0.1);

  @media (max-width: 768px) {
    font-size: 5rem;
  }

  @media (max-width: 480px) {
    font-size: 4rem;
  }
`;

const Slogan = styled(motion.h2)`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};
  opacity: 0.9;
  letter-spacing: -0.01em;
  font-family: 'Cabinet Grotesk', sans-serif;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 3rem;
  line-height: 1.6;
  max-width: 600px;
  opacity: 0.8;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 2rem;
`;

const GetStartedButton = styled(Button)`
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
`;

const ScrollReveal = styled(motion.div)`
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  z-index: 100;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  svg {
    width: 20px;
    height: 20px;
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-5px);
    }
    60% {
      transform: translateY(-3px);
    }
  }
`;

const Section = styled(motion.section)`
  width: 100%;
  max-width: 1000px;
  margin: 6rem 0;
  padding: 2rem;
  position: relative;
  z-index: 1;
  scroll-margin-top: 100px;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.primary};
  text-align: center;
`;

const SectionContent = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Paragraph = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
  line-height: 1.6;
  text-align: left;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const FeatureCard = styled(motion.div)`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: left;
  border: 1px solid ${props => props.theme.colors.border};
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(0, 191, 166, 0.2);
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: ${props => props.theme.colors.text};
`;

const FeatureDescription = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
  flex-grow: 1;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ContactIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 191, 166, 0.2);
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContactText = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
`;

const SocialMediaPlaceholder = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  border: 1px dashed ${props => props.theme.colors.primary};
  border-radius: 8px;
  text-align: center;
  color: ${props => props.theme.colors.lightText};
`;

const Footer = styled.footer`
  width: 100%;
  max-width: 1200px;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  text-align: center;
  color: ${props => props.theme.colors.lightText};
  font-size: 0.875rem;
  position: relative;
  z-index: 1;
`;

const AboutContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const AboutTextContent = styled.div`
  flex: 1;
`;

const AboutImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  overflow: hidden;
  min-height: 400px;
  background: linear-gradient(135deg, rgba(0, 191, 166, 0.1) 0%, rgba(0, 191, 166, 0.05) 100%);
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const AboutImageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.text};
  padding: 2rem;
  text-align: center;
  z-index: 2;
  position: relative;
`;

const AboutImageTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const AboutImageText = styled.p`
  font-size: 1.1rem;
  color: white;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const AboutImageFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const AboutImageFeature = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const PlaceholderIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(0, 191, 166, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  
  svg {
    width: 40px;
    height: 40px;
  }
`;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const aboutRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const handleGetStarted = () => {
    // Add a cool animation before navigating
    const content = document.querySelector('main');
    if (content) {
      content.animate([
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(1.1)' }
      ], {
        duration: 500,
        easing: 'ease-out',
        fill: 'forwards'
      });
      
      // Navigate after animation completes
      setTimeout(() => {
        navigate('/verify-email');
      }, 500);
    } else {
      navigate('/verify-email');
    }
  };

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <Container>
      <GridPattern />
      <SideDecoration className="left" />
      <SideDecoration className="right" />
      <FloatingShape className="shape1" />
      <FloatingShape className="shape2" />
      
      <Header>
        <Logo />
        <NavLinks>
          <NavLink onClick={() => scrollToSection(aboutRef)}>About</NavLink>
          <NavLink onClick={() => scrollToSection(featuresRef)}>Features</NavLink>
          <NavLink onClick={() => scrollToSection(contactRef)}>Contact</NavLink>
        </NavLinks>
      </Header>
      
      <Content>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to UniMart
        </Title>
        
        <Slogan
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          For Students, By Students
        </Slogan>
        
        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Your one-stop platform for buying and selling among students.
          Connect with peers, find what you need, and sell what you don't -
          all within your university community.
        </Subtitle>
        
        <ButtonContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <GetStartedButton onClick={handleGetStarted}>Get Started</GetStartedButton>
        </ButtonContainer>
      </Content>
      
      <ScrollReveal
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        onClick={() => scrollToSection(aboutRef)}
      >
        Explore More
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </ScrollReveal>
      
      <Section 
        ref={aboutRef}
        id="about"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <SectionTitle>About Me</SectionTitle>
        <AboutContainer>
          <AboutTextContent>
            <Paragraph>
              Hey! I'm Abhi, a second-year CS + Economics major at Northeastern University. 
              When I'm not coding or studying market trends, you'll find me cheering for the Seahawks 
              (through thick and thin!) or diving into my favorite games like Fortnite, Marvel Rivals, 
              and Valorant. Nothing beats a good gaming session with friends!
            </Paragraph>
            <Paragraph>
              I'm that guy who's always up for a hangout, whether it's grabbing coffee between classes, 
              playing pickup football, or having intense gaming tournaments. Currently on the hunt for 
              that perfect internship (hint hint, recruiters 👀), and what better way to stand out than 
              building a full-stack marketplace from scratch?
            </Paragraph>
          </AboutTextContent>
          <AboutImageContainer>
            <img 
              src={groupImage} 
              alt="That's me in the middle!"
            />
          </AboutImageContainer>
        </AboutContainer>

        <div style={{ marginTop: '4rem' }}>
          <SectionTitle style={{ fontSize: '2rem' }}>Why UniMart?</SectionTitle>
          <AboutContainer>
            <AboutTextContent>
              <Paragraph>
                UniMart is more than just a marketplace - it's a solution to a problem I've seen 
                firsthand on campus. We've all been there: end of semester, trying to sell textbooks, 
                dorm stuff, or that guitar you swore you'd learn to play (just like my abandoned 
                attempt at learning Valorant lineups 😅). Facebook Marketplace? Too sketchy. 
                Amazon? Too expensive.
              </Paragraph>
              <Paragraph>
                Our platform facilitates sustainable consumption by giving pre-loved items a second life,
                while helping students save money and connect with their peers. Plus, it gave me an 
                excuse to dive deep into React, Spring Boot, and all the cool tech that makes modern 
                web apps tick! Think of it as my way of giving back to the student community while 
                leveling up my dev skills.
              </Paragraph>
            </AboutTextContent>
            <AboutImageContainer style={{ minHeight: '300px' }}>
              <img 
                src={uniMartPhoto} 
                alt="UniMart Platform Preview"
                style={{ objectFit: 'contain' }}
              />
            </AboutImageContainer>
          </AboutContainer>
        </div>
      </Section>
      
      <Section 
        ref={featuresRef}
        id="features"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <SectionTitle>Features</SectionTitle>
        <FeatureGrid>
          <FeatureCard
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <FeatureIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z" fill="currentColor"/>
              </svg>
            </FeatureIcon>
            <FeatureTitle>Secure Authentication</FeatureTitle>
            <FeatureDescription>
              We verify all users through their .edu email addresses and implement one-time authentication codes, ensuring that only legitimate students can access the marketplace.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <FeatureIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
              </svg>
            </FeatureIcon>
            <FeatureTitle>University-Specific Marketplace</FeatureTitle>
            <FeatureDescription>
              Students can buy and sell items exclusively within their own university community, making exchanges convenient and building a trusted network of peers.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <FeatureIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 13H5V11H3V13ZM3 17H5V15H3V17ZM3 9H5V7H3V9ZM7 13H21V11H7V13ZM7 17H21V15H7V17ZM7 7V9H21V7H7Z" fill="currentColor"/>
              </svg>
            </FeatureIcon>
            <FeatureTitle>User-Friendly Listings</FeatureTitle>
            <FeatureDescription>
              Easily post items for sale, search for specific products, and filter results to find exactly what you need within your campus community.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <FeatureIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4C2.9 2 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
              </svg>
            </FeatureIcon>
            <FeatureTitle>Messaging System</FeatureTitle>
            <FeatureDescription>
              Communicate securely with other students through our built-in messaging system before making a purchase, allowing you to ask questions and arrange meetups.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <FeatureIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.11 21 21 20.1 21 19V5C21 3.9 20.11 3 19 3ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="currentColor"/>
              </svg>
            </FeatureIcon>
            <FeatureTitle>Order Management</FeatureTitle>
            <FeatureDescription>
              Benefit from features like automatic relisting of canceled orders, notifications for pickup deadlines, and detailed purchase receipts for your records.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <FeatureIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="currentColor"/>
              </svg>
            </FeatureIcon>
            <FeatureTitle>User Reviews & Reporting</FeatureTitle>
            <FeatureDescription>
              Edit seller reviews, report fake reviews, and trust our strict banning policy to maintain a high-quality marketplace experience for all users.
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </Section>
      
      <Section 
        ref={contactRef}
        id="contact"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <SectionTitle>Contact Us</SectionTitle>
        <SectionContent>
          <ContactInfo>
            <ContactItem>
              <ContactIcon>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
                </svg>
              </ContactIcon>
              <ContactText>studentunimart@gmail.com</ContactText>
            </ContactItem>
            
            <ContactItem>
              <ContactIcon>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor"/>
                </svg>
              </ContactIcon>
              <ContactText>732-353-8395</ContactText>
            </ContactItem>
          </ContactInfo>
          
          <SocialMediaPlaceholder>
            Area for links to sites that are gonna go famous Lol
          </SocialMediaPlaceholder>
        </SectionContent>
      </Section>
      
      <Footer>
        © {new Date().getFullYear()} UniMart. All rights reserved.
      </Footer>
    </Container>
  );
};

export default LandingPage; 