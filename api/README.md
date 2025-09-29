# Quick Market Backend API

Backend API for Quick Market e-grocery platform built with Node.js, Express, and PostgreSQL.

## Setup Instructions

### 1. Database Setup
```bash
# Create PostgreSQL database
createdb quickmarket

# Run schema
psql -d quickmarket -f database/schema.sql
```

### 2. Environment Variables
Copy `.env.example` to `.env` and configure:

**REQUIRED PLACEHOLDERS TO REPLACE:**
- `JWT_SECRET`: Generate a strong secret key
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: From Google OAuth Console
- `PAYSTACK_SECRET_KEY` & `PAYSTACK_PUBLIC_KEY`: From Paystack Dashboard
- `RESEND_API_KEY`: From Resend Dashboard
- `CLOUDINARY_*`: From Cloudinary Console
- Database credentials

### 3. Installation & Start
```bash
npm install
npm run dev  # Development
npm start    # Production
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `GET /api/auth/google` - Google OAuth
- `POST /api/auth/verify-email` - Email verification

### Users
- `GET /api/users/profile` - Get user profile
- `POST /api/users/select-location` - Select delivery location
- `GET /api/users/locations` - Get available locations

### Products
- `GET /api/products` - Get products with filtering
- `GET /api/products/:slug` - Get single product
- `GET /api/products/categories` - Get categories

### Subscriptions
- `GET /api/subscriptions/packages` - Get subscription packages
- `POST /api/subscriptions/purchase` - Purchase subscription

### Orders
- `POST /api/orders` - Create order (Sunday-Tuesday only)
- `GET /api/orders` - Get user orders

### Payments
- `POST /api/payments/initialize` - Initialize Paystack payment
- `POST /api/payments/verify` - Verify payment

## Key Features Implemented

✅ **Google OAuth Integration**
✅ **JWT Authentication** 
✅ **Location-based Pricing**
✅ **Subscription Management**
✅ **Order Window Validation** (Sun-Tue only)
✅ **Email Notifications** (Resend)
✅ **Payment Processing** (Paystack)
✅ **Image Upload** (Cloudinary ready)
✅ **PostgreSQL Database** with full schema

## Missing Implementation (Placeholders)

### Email Templates
- Delivery reminder emails  
- Order status updates
- Subscription expiry notifications

### Admin Routes
- Product management
- Order management
- User management

### File Upload
- Cloudinary integration for product images
- User avatar uploads

## Usage with Next.js Frontend

All routes are designed to work with any frontend. For Next.js:

```javascript
// In your Next.js API routes or client-side code
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // For protected routes
  },
  body: JSON.stringify({ email, password })
});
```

The backend is completely independent and will work with any frontend framework.