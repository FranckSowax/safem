# File Structure for Safem SaaS

## Overview

This document outlines the file structure for the Safem SaaS platform, covering both the backend and frontend repositories. The backend uses Supabase with PostgreSQL, and the frontend is built with Next.js and React, styled with Tailwind CSS. The structure ensures modularity, scalability, and maintainability.

## Backend Repository (safem-backend)

```
safem-backend/
├── config/                 # Configuration files
│   ├── db.js               # Supabase client setup
│   └── storage.js          # Supabase Storage configuration
├── controllers/            # Request handlers
│   ├── authController.js   # Handles login/register/logout
│   ├── productController.js# Manages product CRUD
│   ├── orderController.js  # Manages orders
│   ├── subscriptionController.js # Manages subscriptions
│   ├── eventController.js  # Manages events
│   ├── testimonialController.js # Manages testimonials
│   └── newsletterController.js # Manages newsletter subscriptions
├── middleware/             # Custom middleware
│   ├── auth.js             # Supabase Auth middleware
│   ├── validate.js         # Request validation middleware
│   └── error.js            # Error handling middleware
├── models/                 # Database schemas (Supabase)
│   ├── User.js             # User schema
│   ├── Address.js          # Address schema
│   ├── Category.js         # Category schema
│   ├── Producer.js         # Producer schema
│   ├── Product.js          # Product schema
│   ├── ProductImage.js     # Product image schema
│   ├── SubscriptionPlan.js # Subscription plan schema
│   ├── UserSubscription.js # User subscription schema
│   ├── Order.js            # Order schema
│   ├── OrderItem.js        # Order item schema
│   ├── Event.js            # Event schema
│   ├── EventRegistration.js # Event registration schema
│   ├── Review.js           # Review schema
├── routes/                 # API routes
│   ├── auth.js             # Auth routes
│   ├── products.js         # Product routes
│   ├── orders.js           # Order routes
│   ├── subscriptions.js    # Subscription routes
│   ├── events.js           # Event routes
│   ├── testimonials.js     # Testimonial routes
│   └── newsletters.js      # Newsletter routes
├── utils/                  # Utility functions
│   ├── logger.js           # Logging setup
│   ├── stripe.js           # Stripe payment utilities
│   └── sendEmail.js        # SendGrid email utilities
├── .env                    # Environment variables (e.g., Supabase URL, Stripe keys)
├── server.js               # Entry point for the application
└── package.json            # Dependencies and scripts
```

## Frontend Repository (safem-frontend)

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

## Notes

- **Modularity**: Both repositories are structured to keep concerns separated (e.g., controllers, components).
- **Environment Variables**: .env (backend) and .env.local (frontend) store sensitive data like API keys.
- **Scalability**: The structure supports adding new features (e.g., new pages, API routes) without major refactoring.
- **Consistency**: File naming follows camelCase for JavaScript files (e.g., productController.js, ProductCard.js).
