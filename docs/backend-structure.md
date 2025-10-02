# Backend Structure for Safem SaaS

## Overview

Safem is a SaaS platform for selling organic produce from a semi-agro-industrial farm in Gabon, featuring an e-commerce system with product listings, subscriptions, events, and customer engagement. The backend uses Supabase with PostgreSQL, React with Next.js for the frontend, and integrates Stripe for payments and SendGrid for emails. The architecture supports scalability, security, and real-time updates.

## Tech Stack

- **Frontend**: React with Next.js
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **API Layer**: RESTful APIs + Supabase Realtime
- **Payment Processing**: Stripe
- **Email Service**: SendGrid
- **Hosting/Deployment**: Vercel

## Folder Structure

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

## Database Schema

### Core Tables

#### users
- id UUID PRIMARY KEY
- email VARCHAR UNIQUE
- first_name VARCHAR
- last_name VARCHAR
- phone VARCHAR
- role ENUM ('customer', 'admin', 'producer')
- avatar_url VARCHAR
- preferences JSONB
- created_at TIMESTAMP
- updated_at TIMESTAMP

#### addresses
- id UUID PRIMARY KEY
- user_id UUID REFERENCES users
- address_line1 VARCHAR
- address_line2 VARCHAR
- city VARCHAR
- postal_code VARCHAR
- country VARCHAR
- is_default BOOLEAN
- type ENUM ('shipping', 'billing', 'both')
- created_at TIMESTAMP
- updated_at TIMESTAMP

#### categories
- id UUID PRIMARY KEY
- name VARCHAR
- slug VARCHAR UNIQUE
- description TEXT
- parent_id UUID REFERENCES categories
- image_url VARCHAR
- order_rank INTEGER
- created_at TIMESTAMP
- updated_at TIMESTAMP

#### producers
- id UUID PRIMARY KEY
- user_id UUID REFERENCES users
- name VARCHAR
- slug VARCHAR UNIQUE
- description TEXT
- short_description VARCHAR
- logo_url VARCHAR
- cover_image_url VARCHAR
- location VARCHAR
- coordinates POINT
- specialties VARCHAR[]
- created_at TIMESTAMP
- updated_at TIMESTAMP

#### products
- id UUID PRIMARY KEY
- name VARCHAR
- slug VARCHAR UNIQUE
- description TEXT
- short_description VARCHAR
- price DECIMAL(10,2)
- compare_at_price DECIMAL(10,2)
- category_id UUID REFERENCES categories
- producer_id UUID REFERENCES producers
- unit VARCHAR
- weight DECIMAL(10,2)
- weight_unit VARCHAR
- stock_quantity INTEGER
- is_organic BOOLEAN
- is_featured BOOLEAN
- available_from DATE
- available_until DATE
- images JSONB
- nutrition_facts JSONB
- storage_tips TEXT
- badges VARCHAR[]
- created_at TIMESTAMP
- updated_at TIMESTAMP

#### product_images
- id UUID PRIMARY KEY
- product_id UUID REFERENCES products
- url VARCHAR
- alt_text VARCHAR
- is_primary BOOLEAN
- order_rank INTEGER
- created_at TIMESTAMP

#### subscription_plans
- id UUID PRIMARY KEY
- name VARCHAR
- slug VARCHAR UNIQUE
- description TEXT
- short_description VARCHAR
- image_url VARCHAR
- price DECIMAL(10,2)
- discount_percentage INTEGER
- frequency ENUM ('weekly', 'biweekly', 'monthly')
- is_customizable BOOLEAN
- products_included JSONB
- is_active BOOLEAN
- created_at TIMESTAMP
- updated_at TIMESTAMP

#### user_subscriptions
- id UUID PRIMARY KEY
- user_id UUID REFERENCES users
- plan_id UUID REFERENCES subscription_plans
- status ENUM ('active', 'paused', 'cancelled')
- start_date DATE
- end_date DATE
- next_delivery_date DATE
- delivery_address_id UUID REFERENCES addresses
- custom_products JSONB
- payment_method_id VARCHAR
- payment_status VARCHAR
- created_at TIMESTAMP
- updated_at TIMESTAMP

#### orders
- id UUID PRIMARY KEY
- user_id UUID REFERENCES users
- order_number VARCHAR UNIQUE
- status ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled')
- total_amount DECIMAL(10,2)
- subtotal DECIMAL(10,2)
- shipping_cost DECIMAL(10,2)
- tax_amount DECIMAL(10,2)
- discount_amount DECIMAL(10,2)
- payment_method VARCHAR
- payment_status ENUM ('pending', 'paid', 'failed', 'refunded')
- payment_intent_id VARCHAR
- shipping_address_id UUID REFERENCES addresses
- billing_address_id UUID REFERENCES addresses
- delivery_method VARCHAR
- delivery_date DATE
- delivery_timeslot VARCHAR
- notes TEXT
- created_at TIMESTAMP
- updated_at TIMESTAMP

#### order_items
- id UUID PRIMARY KEY
- order_id UUID REFERENCES orders
- product_id UUID REFERENCES products
- quantity INTEGER
- unit_price DECIMAL(10,2)
- subtotal DECIMAL(10,2)
- created_at TIMESTAMP
- updated_at TIMESTAMP

#### events
- id UUID PRIMARY KEY
- title VARCHAR
- slug VARCHAR UNIQUE
- description TEXT
- short_description VARCHAR
- image_url VARCHAR
- start_date TIMESTAMP
- end_date TIMESTAMP
- location VARCHAR
- coordinates POINT
- capacity INTEGER
- price DECIMAL(10,2)
- is_free BOOLEAN
- registration_required BOOLEAN
- registration_deadline TIMESTAMP
- event_type VARCHAR
- status VARCHAR
- created_at TIMESTAMP
- updated_at TIMESTAMP

#### event_registrations
- id UUID PRIMARY KEY
- event_id UUID REFERENCES events
- user_id UUID REFERENCES users
- status VARCHAR
- participants_count INTEGER
- payment_status VARCHAR
- payment_intent_id VARCHAR
- created_at TIMESTAMP
- updated_at TIMESTAMP

#### reviews
- id UUID PRIMARY KEY
- user_id UUID REFERENCES users
- product_id UUID REFERENCES products
- rating INTEGER CHECK (rating BETWEEN 1 AND 5)
- title VARCHAR
- comment TEXT
- is_verified_purchase BOOLEAN
- is_visible BOOLEAN
- is_approved BOOLEAN
- created_at TIMESTAMP
- updated_at TIMESTAMP

## API Endpoints

### Authentication
- POST /auth/register - Register new user
- POST /auth/login - Login
- POST /auth/logout - Logout
- POST /auth/reset-password - Reset password
- GET /auth/user - Get current user

### Products
- GET /products - List products with filters
- GET /products/:slug - Get product details
- GET /products/featured - Get featured products
- GET /products/category/:slug - Get products by category
- GET /products/producer/:slug - Get products by producer
- POST /products - Create product (admin only)
- PUT /products/:id - Update product (admin only)
- DELETE /products/:id - Delete product (admin only)

### Categories
- GET /categories - List categories
- GET /categories/:slug - Get category details
- POST /categories - Create category (admin only)
- PUT /categories/:id - Update category (admin only)
- DELETE /categories/:id - Delete category (admin only)

### Producers
- GET /producers - List producers
- GET /producers/:slug - Get producer details
- POST /producers - Create producer (admin only)
- PUT /producers/:id - Update producer (admin only)
- DELETE /producers/:id - Delete producer (admin only)

### Cart
- GET /cart - Get cart
- POST /cart/items - Add item to cart
- PUT /cart/items/:id - Update cart item
- DELETE /cart/items/:id - Remove cart item
- DELETE /cart - Clear cart

### Orders
- POST /orders - Create order
- GET /orders - List user orders
- GET /orders/:id - Get order details
- PUT /orders/:id/cancel - Cancel order
- GET /orders/:id/invoice - Get order invoice

### Subscriptions
- GET /subscription-plans - List subscription plans
- POST /subscriptions - Create subscription
- GET /subscriptions - List user subscriptions
- GET /subscriptions/:id - Get subscription details
- PUT /subscriptions/:id - Update subscription
- PUT /subscriptions/:id/pause - Pause subscription
- PUT /subscriptions/:id/resume - Resume subscription
- PUT /subscriptions/:id/cancel - Cancel subscription

### Events
- GET /events - List events
- GET /events/:slug - Get event details
- POST /events/:id/register - Register for event
- DELETE /events/:id/register - Cancel event registration

### User Profile
- GET /profile - Get user profile
- PUT /profile - Update user profile
- GET /profile/addresses - Get user addresses
- POST /profile/addresses - Add address
- PUT /profile/addresses/:id - Update address
- DELETE /profile/addresses/:id - Delete address

### Reviews
- GET /products/:id/reviews - Get product reviews
- POST /products/:id/reviews - Add review
- PUT /reviews/:id - Update review
- DELETE /reviews/:id - Delete review

### Admin
- GET /admin/dashboard - Get admin dashboard data
- GET /admin/orders - List all orders
- PUT /admin/orders/:id/status - Update order status
- GET /admin/users - List all users
- PUT /admin/users/:id/role - Update user role
- GET /admin/stats - Get sales statistics

## Security Implementation

### Row Level Security (RLS)
Example RLS policy for Orders:

```sql
CREATE POLICY "Users can only view their own orders"
ON orders
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
ON orders
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'admin'
));
```

### Authentication Flow
- User registers or logs in through Supabase Auth
- Supabase issues a JWT token
- Token is stored in browser and included in all subsequent requests
- Backend validates token and applies RLS policies

## Scheduled Tasks and Functions

### Order Processing
Function to process orders:

```sql
CREATE OR REPLACE FUNCTION process_order()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET stock_quantity = stock_quantity - NEW.quantity
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_order_item_insert
  AFTER INSERT ON order_items
  FOR EACH ROW
  EXECUTE PROCEDURE process_order();
```

### Subscription Processing
Function to process subscriptions daily:

```sql
CREATE OR REPLACE FUNCTION process_subscriptions()
RETURNS INTEGER AS $$
DECLARE
  subscription_count INTEGER := 0;
BEGIN
  FOR subscription IN 
    SELECT * FROM user_subscriptions
    WHERE status = 'active'
    AND next_delivery_date = CURRENT_DATE
  LOOP
    -- Create order from subscription
    -- ... (order creation logic)
    UPDATE user_subscriptions
    SET next_delivery_date = CASE
      WHEN frequency = 'weekly' THEN next_delivery_date + INTERVAL '7 days'
      WHEN frequency = 'biweekly' THEN next_delivery_date + INTERVAL '14 days'
      WHEN frequency = 'monthly' THEN next_delivery_date + INTERVAL '1 month'
    END
    WHERE id = subscription.id;
    subscription_count := subscription_count + 1;
  END LOOP;
  RETURN subscription_count;
END;
$$ LANGUAGE plpgsql;
```

## Integration with External Services

### Stripe Payment Integration

```javascript
const createPaymentIntent = async (orderId) => {
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.total_amount * 100),
    currency: 'eur',
    metadata: { order_id: orderId, order_number: order.order_number }
  });
  await supabase
    .from('orders')
    .update({ payment_intent_id: paymentIntent.id })
    .eq('id', orderId);
  return paymentIntent.client_secret;
};
```

### SendGrid Email Service

```javascript
const sendOrderConfirmation = async (orderId) => {
  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      user:users(email, first_name, last_name),
      items:order_items(*, product:products(name, slug))
    `)
    .eq('id', orderId)
    .single();
  await sendgrid.send({
    to: order.user.email,
    from: 'no-reply@safem.fr',
    subject: `Confirmation de commande #${order.order_number}`,
    templateId: 'd-order-confirmation-template',
    dynamicTemplateData: {
      order_number: order.order_number,
      first_name: order.user.first_name,
      items: order.items,
      total: order.total_amount,
      shipping_cost: order.shipping_cost,
      delivery_date: order.delivery_date
    }
  });
};
```

### Storage Buckets
Bucket Configuration:

```javascript
const buckets = [
  { id: 'product-images', public: true },
  { id: 'producer-images', public: true },
  { id: 'category-images', public: true },
  { id: 'event-images', public: true },
  { id: 'user-avatars', public: true },
  { id: 'blog-images', public: true }
];
const productImagePolicy = {
  bucketId: 'product-images',
  name: 'Public product images',
  policyType: 'SELECT',
  definition: { statements: [{ effect: 'ALLOW', principal: '*' }] }
};
```

## Performance Optimizations

### Database Indexes

```sql
CREATE INDEX product_search_idx ON products 
USING gin(to_tsvector('french', name || ' ' || coalesce(description, '')));
CREATE INDEX products_category_id_idx ON products(category_id);
CREATE INDEX products_producer_id_idx ON products(producer_id);
CREATE INDEX products_is_featured_idx ON products(is_featured) WHERE is_featured = true;
CREATE INDEX orders_user_id_idx ON orders(user_id);
CREATE INDEX user_subscriptions_next_delivery_date_idx ON user_subscriptions(next_delivery_date);
CREATE INDEX events_start_date_idx ON events(start_date);
```

### Caching Strategy
- Product catalog cached for 5 minutes
- Static content (category lists, producer lists) cached for 1 hour
- Dynamic user content (cart, orders) not cached
- In-memory cache for frequently accessed data

## Monitoring and Error Handling

### Logging Strategy
- API request/response logging
- Error logging with full context
- Performance monitoring
- User activity tracking for analytics

### Error Handling

```javascript
const errorHandler = (err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  logger.error({
    error: err.message,
    stack: err.stack,
    user: req.user?.id,
    path: req.path,
    method: req.method,
    ip: req.ip
  });
  if (err.type === 'validation') {
    return res.status(400).json({ error: err.message, details: err.details });
  }
  if (err.type === 'not_found') {
    return res.status(404).json({ error: 'Resource not found' });
  }
  return res.status(500).json({ error: 'Internal server error' });
};
```

## Setup Instructions
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file with:
```
SUPABASE_URL=<your-supabase-url>
SUPABASE_KEY=<your-supabase-key>
STRIPE_SECRET_KEY=<your-stripe-secret-key>
SENDGRID_API_KEY=<your-sendgrid-api-key>
```
4. Run `npm start` to start the server.
