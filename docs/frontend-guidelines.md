# Frontend Guidelines for Safem SaaS

## Overview

The Safem frontend is a React-based application built with Next.js, designed to showcase organic produce from a semi-agro-industrial farm in Gabon. It reflects the clean, sustainable aesthetic of the provided template, featuring a responsive layout, product cards, testimonials, and newsletter subscriptions. These guidelines ensure consistency, performance, and scalability while integrating with the Supabase backend.

## Tech Stack

- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS (with custom theme)
- **State Management**: React Context or Zustand (for lightweight state)
- **Routing**: Next.js App Router
- **API Integration**: Supabase Client
- **Deployment**: Vercel
- **Testing**: React Testing Library, Jest

## Design Principles

- **Consistency**: Use the template's green (#2E7D32) and white (#FFFFFF) color scheme, with accents of light gray (#F5F5F5).
- **Responsiveness**: Ensure a mobile-first design, with breakpoints at 640px, 768px, 1024px, and 1280px.
- **Accessibility**: Follow WCAG 2.1 guidelines (e.g., alt text for images, keyboard navigation).
- **Performance**: Optimize images and leverage Next.js static generation where possible.

## Folder Structure

```
safem-frontend/
├── public/                 # Static assets (logos, icons)
│   ├── images/             # Product images, banners
│   └── favicon.ico
├── src/                    # Source code
│   ├── components/         # Reusable components
│   │   ├── Header.js       # Navigation bar
│   │   ├── Footer.js       # Footer with contact info
│   │   ├── ProductCard.js  # Product display component
│   │   ├── TestimonialCard.js # Customer testimonial component
│   │   └── NewsletterForm.js # Newsletter subscription form
│   ├── layouts/            # Layout templates
│   │   ├── MainLayout.js   # Default layout with header/footer
│   ├── pages/              # Next.js pages
│   │   ├── index.js        # Homepage
│   │   ├── products/[slug].js # Product details page
│   │   ├── about.js        # About page
│   │   └── contact.js      # Contact page
│   ├── hooks/              # Custom hooks
│   │   ├── useAuth.js      # Authentication hook
│   │   └── useCart.js      # Cart management hook
│   ├── utils/              # Utility functions
│   │   ├── formatPrice.js  # Price formatting
│   │   └── api.js          # Supabase API calls
│   ├── styles/             # Global styles
│   │   ├── globals.css     # Tailwind base styles
│   │   └── theme.css       # Custom theme
│   ├── context/            # Context providers
│   │   ├── AuthContext.js  # Authentication context
│   └── app/                # Next.js App Router files
│       ├── layout.js       # Root layout
│       └── page.js         # Home page
├── .env.local              # Environment variables (e.g., Supabase URL)
├── next.config.js          # Next.js configuration
└── package.json            # Dependencies and scripts
```

## Component Guidelines

### 1. Header
- Include a logo ("Safem Organic") on the left.
- Navigation links: Home, Products, About, Contact.
- Responsive: Collapsible menu on mobile (<768px).
- Style: Green background, white text, hover effects.

### 2. ProductCard
- Display product name, price (e.g., "$599"), and image.
- Add a "Shop Now" button with a green background.
- Responsive: Stack content on mobile, grid layout on desktop (>1024px).
- Use lazy-loaded images with next/image.

### 3. TestimonialCard
- Show user name, quote, and rating (1-5 stars).
- Style: Light gray background, centered text.
- Responsive: Single column on mobile, two columns on desktop (>1024px).

### 4. NewsletterForm
- Include email input and "Subscribe" button.
- Style: Green button, white input field with subtle border.
- Validate email client-side before submission.

## Styling Guidelines

### Colors:
- Primary: #2E7D32 (green)
- Secondary: #FFFFFF (white)
- Background: #F5F5F5 (light gray)
- Text: #333333 (dark gray)

### Typography: 
- Use a clean sans-serif font (e.g., "Roboto" via Google Fonts).
- Headings: 24px (h1), 20px (h2), 16px (h3)
- Body: 14px

### Layout:
- Spacing: Use Tailwind's spacing scale (e.g., p-4, m-2).
- Shadows: Subtle box-shadow for cards (e.g., shadow-md).

## Routing and Navigation

- Use Next.js dynamic routes for product pages (e.g., /products/[slug]).
- Implement client-side navigation with Link component.
- Ensure deep linking for SEO (e.g., /products/organic-tomato).

## API Integration

- Use Supabase Client for authentication and data fetching.
- Example: Fetch products:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);

export async function getProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
  return data;
}
```

- Handle errors with user-friendly messages (e.g., "Failed to load products").

## Performance Optimization

- Use next/image for optimized image loading.
- Implement static generation for product listings (getStaticProps).
- Enable code splitting with dynamic imports for large components.

## Accessibility

- Add aria-labels to interactive elements (e.g., buttons, links).
- Ensure sufficient color contrast (e.g., green text on white).
- Support keyboard navigation for all actions.

## Testing

- Write unit tests for components using React Testing Library.
- Example:

```javascript
import { render, screen } from '@testing-library/react';
import ProductCard from '../components/ProductCard';

test('renders product name and price', () => {
  render(<ProductCard name="Organic Tomato" price={599} />);
  expect(screen.getByText('Organic Tomato')).toBeInTheDocument();
  expect(screen.getByText('$599')).toBeInTheDocument();
});
```

- Test responsiveness across breakpoints.

## Deployment

- Deploy to Vercel with vercel deploy.
- Set environment variables in Vercel dashboard (e.g., Supabase credentials).
- Monitor build performance and optimize as needed.

## Best Practices

- Keep components stateless where possible, using hooks for state.
- Use TypeScript for type safety (optional but recommended).
- Document components with JSDoc or comments for maintainability.
- Version control with Git, following a feature/branch-name convention.

## Next Steps

- Implement a cart component with real-time updates.
- Add a search bar for products.
- Design an admin dashboard page for managing products and orders.
