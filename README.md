# 🛒 UniMart - E-commerce Platform
Welcome to UniMart, a student exclusive e-commerce platform that allows users to explore, shop, and manage products seamlessly. Whether you're a student or a teacher looking to sell your products or a customer browsing for your next purchase, UniMart provides a modern and intuitive solution for all your e-commerce needs.

# 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.


# 🌟 Features
Product Listings: Easily browse through a wide range of products with detailed descriptions and pricing.

User Authentication: Secure login and registration system for both customers and administrators.

Product Management: Admins can add, update, or remove products from the catalog.

Cart and Checkout: Users can add items to their cart and proceed through a smooth checkout process.

Order History: Customers can view their past orders and track the status of ongoing deliveries.


# 🛠️ Basic Facts + Tech Stack
2. Made For Students, By Students
3. Tech Stack:
    - Backend:
        - MySQL
        - Java Spring
        - Docker
        - Java Spring Mail + Other Dependencies
        - Maven Build Tool 
    - Front-end (ngl made using AI):
        - TypeScript
        - Node.JS
        - React.JS
        - HTML/CSS 
    - Cloud (AWS Most likely)
    - Diagram: Lucid Charts
        - https://lucid.app/lucidchart/be0482db-c922-436e-b261-9007d8736752/edit?page=0_0&invitationId=inv_aa66d6e8-6829-4ee1-ba72-37001e6e493e#

5. First store will be HuskyMart, a Northeastern Marketplace

**Will come back to this**

# UniMart - A Modular Multi-College Marketplace Platform

UniMart is a platform that allows students from different colleges to buy and sell items within their campus community. The platform is designed to be modular and scalable, making it easy to add new college marketplaces.

## Features

- Multiple college-specific marketplaces with custom theming
- User authentication and profile management
- Product listing and search
- Category-based browsing
- Shopping cart and checkout
- Messaging system for buyer-seller communication
- Responsive design for mobile and desktop

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/unimart.git
cd unimart
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm run dev
```

## Creating a New Marketplace

UniMart is designed to make it easy to create new college-specific marketplaces. The platform uses a modular approach with reusable components and themes.

### Step 1: Define College Theme

Add your college theme to the `collegeThemes.ts` file:

```typescript
// In frontend/src/config/collegeThemes.ts
export const collegeThemes = {
  // ... existing themes
  
  newcollege: {
    name: 'NewCollegeMart',
    colors: {
      primary: '#PrimaryColor',
      secondary: '#SecondaryColor',
      accent: '#AccentColor',
      background: '#BackgroundColor',
      text: '#TextColor',
      error: '#ErrorColor',
      headerBg: '#HeaderColor',
      navBg: '#NavColor',
    },
    logo: '/images/newcollege-logo.png',
    mascot: '/images/newcollege-mascot.png',
    routes: {
      home: '/newcollege',
      market: '/newcollegemart',
    }
  },
};
```

### Step 2: Create Marketplace Page

Create a new marketplace page using the `createMarketplace` utility:

```typescript
// In frontend/src/pages/NewCollegeMartPage.tsx
import React from 'react';
import createMarketplace from '../utils/createMarketplace';

// Optional: Define dummy products or fetch them from an API
const dummyProducts = [
  {
    id: 1,
    title: "Sample Product",
    price: 45.99,
    image: "https://example.com/product.jpg",
    condition: "New",
    category: "Electronics"
  },
  // ... more products
];

// Create the marketplace page
const NewCollegeMartPage = createMarketplace({
  collegeName: 'newcollege',
  categories: ['Books', 'Electronics', 'Clothing', 'Furniture', 'Other'],
  dummyProducts,
  // Add custom handlers if needed
});

export default NewCollegeMartPage;
```

### Step 3: Add Routes to App.tsx

Update the App.tsx file to include routes for your new marketplace:

```typescript
// In frontend/src/App.tsx
import NewCollegeMartPage from './pages/NewCollegeMartPage';

// Inside the Routes component:
<Routes>
  {/* ... existing routes */}
  
  {/* New College Routes */}
  <Route path="/newcollegemart" element={<NewCollegeMartPage />} />
  <Route path="/newcollege" element={<Navigate to="/newcollegemart" replace />} />
  
  {/* ... other routes */}
</Routes>

// Inside the MarketplaceRouter component:
const MarketplaceRouter = () => {
  // ... existing code
  
  switch (collegeName.toLowerCase()) {
    // ... existing cases
    
    case 'newcollege':
    case 'newcollegemart':
      return <Navigate to="/newcollegemart" replace />;
      
    // ... default case
  }
};
```

## Project Structure

- `/frontend` - React frontend application
  - `/src`
    - `/components` - Reusable UI components
    - `/config` - Configuration files including themes
    - `/context` - React context providers
    - `/pages` - Page components
    - `/services` - API services
    - `/styles` - Global styles
    - `/utils` - Utility functions including marketplace creation
- `/backend` - Backend API server
- `/database-scripts` - Database setup scripts

## Component Reference

- `MarketplaceHeader` - Reusable header component for marketplace pages
- `MarketplaceTemplate` - Base template for marketplace pages
- `ProductCard` - Reusable card component for product listings
- `createMarketplace` - Utility function to create marketplace pages

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature-name`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- All the college communities that inspired this project
- Open source libraries and tools used in this project
