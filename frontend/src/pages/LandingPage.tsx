import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import uniMartPhoto from '../assets/images/PhotoForUniMart.jpg';
import backgroundImage from '../assets/images/unimartLandingPageBackground.jpg';
import aboutUsPic from '../assets/images/AboutUsPic.JPG';
import northeasternLogo from '../assets/images/northeasternlogo.webp';
import rutgersLogo from '../assets/images/rutgersLogo.webp';
import mitLogo from '../assets/images/mitlogo.png';
import buLogo from '../assets/images/bulogo.png';
import harvardLogo from '../assets/images/harvardlogo.png';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 0;
  background-color: ${props => props.theme.colors.background};
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
  overflow-x: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.theme.colors.background};
    opacity: 0.85;
    z-index: 0;
  }
`;

// New top bar styled like the image
const TopBar = styled.div`
  width: 100%;
  background-color: ${props => props.theme.colors.background};
  padding: 1rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 0 2rem;
  position: relative;
`;

const NavPill = styled.div`
  background-color: rgba(45, 212, 191, 0.1);
  border-radius: 50px;
  padding: 0.5rem;
  display: flex;
  gap: 0.25rem;
  position: relative;
  z-index: 2;
`;

const NavButton = styled.button<{ active?: boolean }>`
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? '#fff' : props.theme.colors.primary};
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  box-shadow: ${props => props.active ? '0 4px 8px rgba(45, 212, 191, 0.2)' : 'none'};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : 'rgba(45, 212, 191, 0.15)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(45, 212, 191, 0.15);
    
    &::before {
      left: 100%;
    }
  }
`;

const CartAnimation = styled.div`
  position: absolute;
  top: 10px;
  width: 100%;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  animation: moveCart 18s linear infinite;
  z-index: 1;
  
  @keyframes moveCart {
    0% {
      transform: translateX(30px);
      opacity: 0;
    }
    5% {
      transform: translateX(70px);
      opacity: 1;
    }
    20% {
      transform: translateX(calc(50% - 300px));
      opacity: 1;
    }
    22% {
      transform: translateX(calc(50% - 280px));
      opacity: 0;
    }
    50% {
      transform: translateX(calc(50% + 280px));
      opacity: 0;
    }
    52% {
      transform: translateX(calc(50% + 300px));
      opacity: 1;
    }
    95% {
      transform: translateX(calc(100% - 70px));
      opacity: 1;
    }
    98% {
      transform: translateX(calc(100% - 30px));
      opacity: 0;
    }
    100% {
      transform: translateX(30px);
      opacity: 0;
    }
  }
`;

const CartIcon = styled.div`
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  position: relative;
  animation: cartBounce 0.6s ease-in-out infinite alternate;
  filter: drop-shadow(0 0 5px rgba(45, 212, 191, 0.6));
  transition: filter 0.3s ease, transform 0.3s ease;
  
  &:hover {
    filter: drop-shadow(0 0 8px rgba(45, 212, 191, 0.8));
    transform: scale(1.1);
  }
  
  @keyframes cartBounce {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-2px);
    }
  }
  
  svg {
    width: 28px;
    height: 28px;
    filter: drop-shadow(0 2px 4px rgba(45, 212, 191, 0.3));
  }
`;

const CartItems = styled.div`
  position: absolute;
  top: -2px;
  left: 8px;
  width: 12px;
  height: 12px;
`;

const CartItem = styled.div<{ color: string, delay: string, top?: boolean, left?: boolean }>`
  width: 4px;
  height: 4px;
  background-color: ${props => props.color};
  border-radius: 50%;
  position: absolute;
  animation: itemBounce 0.8s ease-in-out infinite alternate;
  animation-delay: ${props => props.delay};
  top: ${props => props.top ? '0px' : '4px'};
  left: ${props => props.left ? '2px' : '6px'};
  
  @keyframes itemBounce {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-1px);
    }
  }
`;

const MenuButton = styled.button`
  background-color: #fff;
  color: #4b5178;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    background-color: #f0f0f0;
  }
  
  svg {
    width: 24px;
    height: 24px;
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
  padding: 0 2rem;
`;

const Title = styled(motion.h1)`
  font-size: 7rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: white;
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-family: 'Clash Display', sans-serif;
  text-transform: uppercase;
  transform: skew(-5deg);
  text-shadow: 4px 4px 0px rgba(45, 212, 191, 0.3);

  span {
    color: ${props => props.theme.colors.primary};
    text-shadow: 4px 4px 0px rgba(255, 255, 255, 0.2);
  }

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
  margin-bottom: 1rem;
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
  margin-top: 1rem;
  margin-bottom: 1rem;
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

const SideBanner = styled.div<{ left?: boolean }>`
  position: fixed;
  ${props => props.left ? 'left: 0;' : 'right: 0;'}
  top: 50%;
  transform: translateY(-50%) ${props => props.left ? 'rotate(-90deg) translateY(-100%)' : 'rotate(90deg) translateY(-100%)'};
  transform-origin: ${props => props.left ? 'left top' : 'right top'};
  background: linear-gradient(90deg, ${props => props.theme.colors.primary}, rgba(45, 212, 191, 0.8));
  color: white;
  padding: 1rem 2rem;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 1px;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  font-family: 'Clash Display', sans-serif;
  text-transform: uppercase;
`;

const CollegeLogoCarousel = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 2rem auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const LogoContainer = styled.div`
  width: 100%;
  height: 80px;
  overflow: hidden;
  position: relative;
`;

const LogoScroller = styled.div`
  display: flex;
  position: absolute;
  animation: scrollLogos 20s linear infinite;
  width: max-content;

  @keyframes scrollLogos {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
`;

const CollegeLogo = styled.div`
  width: 80px;
  height: 60px;
  margin: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  padding: 8px;

  img {
    max-width: 100%;
    max-height: 50px;
    object-fit: contain;
  }
`;

const CarouselTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin-bottom: 10px;
  text-align: center;
  font-family: 'Clash Display', sans-serif;
  
  span {
    color: ${props => props.theme.colors.primary};
  }
`;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const homeRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState('home');

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

  const scrollToSection = (ref: React.RefObject<HTMLElement | HTMLDivElement>) => {
    if (ref === homeRef) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else if (ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const scrollToNextSection = () => {
    const scrollPosition = window.scrollY + 200;
    
    if (scrollPosition < aboutRef.current?.offsetTop!) {
      scrollToSection(aboutRef);
    } else if (scrollPosition < featuresRef.current?.offsetTop!) {
      scrollToSection(featuresRef);
    } else if (scrollPosition < contactRef.current?.offsetTop!) {
      scrollToSection(contactRef);
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      if (homeRef.current && scrollPosition < aboutRef.current?.offsetTop!) {
        setActiveSection('home');
      } else if (aboutRef.current && scrollPosition >= aboutRef.current.offsetTop && scrollPosition < featuresRef.current?.offsetTop!) {
        setActiveSection('about');
      } else if (featuresRef.current && scrollPosition >= featuresRef.current.offsetTop && scrollPosition < contactRef.current?.offsetTop!) {
        setActiveSection('features');
      } else if (contactRef.current && scrollPosition >= contactRef.current.offsetTop) {
        setActiveSection('contact');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logos = [
    { src: northeasternLogo, alt: "Northeastern University" },
    { src: rutgersLogo, alt: "Rutgers University" },
    { src: mitLogo, alt: "MIT" },
    { src: buLogo, alt: "Boston University" },
    { src: harvardLogo, alt: "Harvard University" },
    // Duplicate logos for seamless scrolling
    { src: northeasternLogo, alt: "Northeastern University" },
    { src: rutgersLogo, alt: "Rutgers University" },
    { src: mitLogo, alt: "MIT" },
    { src: buLogo, alt: "Boston University" },
    { src: harvardLogo, alt: "Harvard University" },
  ];

  return (
    <Container>
      <SideBanner left>For Students</SideBanner>
      <SideBanner>By Students</SideBanner>
      
      <TopBar>
        <NavContainer>
          <CartAnimation onClick={handleGetStarted}>
            <CartIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              <CartItems>
                <CartItem color="#ff6b6b" delay="0s" top left />
                <CartItem color="#4ecdc4" delay="0.1s" left={false} />
                <CartItem color="#ffe66d" delay="0.2s" />
              </CartItems>
            </CartIcon>
          </CartAnimation>
          <NavPill>
            <NavButton active={activeSection === 'home'} onClick={() => scrollToSection(homeRef)}>Home</NavButton>
            <NavButton active={activeSection === 'about'} onClick={() => scrollToSection(aboutRef)}>About</NavButton>
            <NavButton active={activeSection === 'features'} onClick={() => scrollToSection(featuresRef)}>Features</NavButton>
            <NavButton active={activeSection === 'contact'} onClick={() => scrollToSection(contactRef)}>Contact</NavButton>
          </NavPill>
        </NavContainer>
      </TopBar>
      
      <div style={{ height: "80px" }} ref={homeRef}></div>
      <Content>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span>W</span><span>elco</span><span>me to</span> Uni<span>Mart</span>
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
        
        <CollegeLogoCarousel style={{ marginTop: '0.5rem' }}>
          <CarouselTitle>Uni<span>Marts</span> Planned or Functional:</CarouselTitle>
          <LogoContainer>
            <LogoScroller>
              {logos.map((logo, index) => (
                <CollegeLogo key={index}>
                  <img src={logo.src} alt={logo.alt} />
                </CollegeLogo>
              ))}
              {logos.slice(0, 5).map((logo, index) => (
                <CollegeLogo key={`duplicate-${index}`}>
                  <img src={logo.src} alt={logo.alt} />
                </CollegeLogo>
              ))}
            </LogoScroller>
          </LogoContainer>
        </CollegeLogoCarousel>
      </Content>
      
      <ScrollReveal
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        onClick={scrollToNextSection}
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
              src={aboutUsPic}
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