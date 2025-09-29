-- Quick Market Database Schema
-- PostgreSQL Schema for the platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255), -- nullable for Google OAuth users
    google_id VARCHAR(255) UNIQUE, -- for Google OAuth
    phone VARCHAR(20),
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    location VARCHAR(50), -- 'yaba', 'lekki_1', 'lekki_2', 'ikeja', 'surulere'
    terms_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscription packages table
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL, -- '2_slots', '4_slots', '6_slots', 'unlimited'
    slots INTEGER, -- null for unlimited
    max_quantity_per_item INTEGER, -- 4, 7, 10, null for unlimited
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Location-based pricing
CREATE TABLE package_pricing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
    location VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User subscriptions
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    package_id UUID REFERENCES packages(id),
    location VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'cancelled'
    slots_used INTEGER DEFAULT 0,
    price_paid DECIMAL(10,2) NOT NULL,
    starts_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    payment_reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product subcategories
CREATE TABLE subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category_id UUID REFERENCES categories(id),
    subcategory_id UUID REFERENCES subcategories(id),
    short_description VARCHAR(500),
    long_description TEXT,
    origin_source VARCHAR(255),
    base_price DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 100.00, -- NGN 100 default, 150 for oil/palm oil
    unit VARCHAR(50) DEFAULT 'piece', -- 'kg', 'bag', 'piece', 'litre'
    stock_quantity INTEGER DEFAULT 0,
    availability_status VARCHAR(20) DEFAULT 'available', -- 'available', 'out_of_stock', 'seasonal'
    main_image_url VARCHAR(500),
    gallery_images TEXT[], -- array of image URLs
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES user_subscriptions(id),
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'
    delivery_date DATE, -- Thursday, Friday, or Saturday
    delivery_address TEXT NOT NULL,
    delivery_notes TEXT,
    payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
    payment_reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Delivery points (pickup locations)
CREATE TABLE delivery_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    location VARCHAR(50) NOT NULL, -- 'yaba', 'lekki_1', etc.
    contact_phone VARCHAR(20),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email notifications log
CREATE TABLE email_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    email_type VARCHAR(50) NOT NULL, -- 'verification', 'order_confirmation', 'delivery_reminder'
    subject VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'sent', -- 'sent', 'failed', 'pending'
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(active);

-- Insert default data
INSERT INTO packages (name, slots, max_quantity_per_item) VALUES
('2_slots', 2, 4),
('4_slots', 4, 7),
('6_slots', 6, 10),
('unlimited', NULL, NULL);

-- Insert package pricing
INSERT INTO package_pricing (package_id, location, price) 
SELECT p.id, locations.location, locations.price
FROM packages p
CROSS JOIN (
    VALUES 
    ('yaba', 6000, 11000, 17000, 19000),
    ('lekki_1', 7500, 14000, 20500, 25000),
    ('lekki_2', 8500, 16000, 20500, 30000),
    ('ikeja', 5500, 10000, 14000, 19000),
    ('surulere', 6000, 11000, 16000, 16000)
) AS locations(location, slot2_price, slot4_price, slot6_price, unlimited_price)
WHERE (p.name = '2_slots' AND locations.slot2_price IS NOT NULL)
   OR (p.name = '4_slots' AND locations.slot4_price IS NOT NULL)
   OR (p.name = '6_slots' AND locations.slot6_price IS NOT NULL)
   OR (p.name = 'unlimited' AND locations.unlimited_price IS NOT NULL);

-- Fix the pricing insert
DELETE FROM package_pricing;

INSERT INTO package_pricing (package_id, location, price) VALUES
-- 2 slots pricing
((SELECT id FROM packages WHERE name = '2_slots'), 'yaba', 6000),
((SELECT id FROM packages WHERE name = '2_slots'), 'lekki_1', 7500),
((SELECT id FROM packages WHERE name = '2_slots'), 'lekki_2', 8500),
((SELECT id FROM packages WHERE name = '2_slots'), 'ikeja', 5500),
((SELECT id FROM packages WHERE name = '2_slots'), 'surulere', 6000),

-- 4 slots pricing
((SELECT id FROM packages WHERE name = '4_slots'), 'yaba', 11000),
((SELECT id FROM packages WHERE name = '4_slots'), 'lekki_1', 14000),
((SELECT id FROM packages WHERE name = '4_slots'), 'lekki_2', 16000),
((SELECT id FROM packages WHERE name = '4_slots'), 'ikeja', 10000),
((SELECT id FROM packages WHERE name = '4_slots'), 'surulere', 11000),

-- 6 slots pricing
((SELECT id FROM packages WHERE name = '6_slots'), 'yaba', 17000),
((SELECT id FROM packages WHERE name = '6_slots'), 'lekki_1', 20500),
((SELECT id FROM packages WHERE name = '6_slots'), 'lekki_2', 20500),
((SELECT id FROM packages WHERE name = '6_slots'), 'ikeja', 14000),
((SELECT id FROM packages WHERE name = '6_slots'), 'surulere', 16000),

-- Unlimited pricing
((SELECT id FROM packages WHERE name = 'unlimited'), 'yaba', 19000),
((SELECT id FROM packages WHERE name = 'unlimited'), 'lekki_1', 25000),
((SELECT id FROM packages WHERE name = 'unlimited'), 'lekki_2', 30000),
((SELECT id FROM packages WHERE name = 'unlimited'), 'ikeja', 19000);

-- Sample categories
INSERT INTO categories (name, slug, description) VALUES
('Grains', 'grains', 'Rice, beans, and other grain products'),
('Vegetables', 'vegetables', 'Fresh vegetables and produce'),
('Fruits', 'fruits', 'Fresh and seasonal fruits'),
('Proteins', 'proteins', 'Meat, fish, and protein sources'),
('Oils', 'oils', 'Cooking oils and palm oil'),
('Spices', 'spices', 'Seasonings and spice blends'),
('Tubers', 'tubers', 'Yam, potatoes, and root vegetables'),
('Pasta', 'pasta', 'Spaghetti and pasta products');

-- Sample delivery points
INSERT INTO delivery_points (name, address, location, contact_phone) VALUES
('Yaba Tech Gate', 'Near Yaba College of Technology Main Gate, Yaba, Lagos', 'yaba', '+2348123456789'),
('Lekki Phase 1 Hub', 'Admiralty Way, Lekki Phase 1, Lagos', 'lekki_1', '+2348123456790'),
('Lekki Phase 2 Point', 'Lekki-Epe Expressway, Lekki Phase 2, Lagos', 'lekki_2', '+2348123456791'),
('Ikeja City Mall', 'Obafemi Awolowo Way, Ikeja, Lagos', 'ikeja', '+2348123456792'),
('Surulere Junction', 'Bode Thomas Street, Surulere, Lagos', 'surulere', '+2348123456793');