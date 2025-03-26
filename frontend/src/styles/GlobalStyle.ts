import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    scroll-behavior: smooth;
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${props => props.theme.colors.background};
    color: #FFFFFF;
    line-height: 1.5;
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }
  
  button, input, textarea, select {
    font-family: inherit;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }

  /* Custom scrollbar for the dark theme */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #1E1E1E;
  }

  ::-webkit-scrollbar-thumb {
    background: #333333;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555555;
  }
`;

export default GlobalStyle; 