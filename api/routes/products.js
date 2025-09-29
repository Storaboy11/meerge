const express = require('express');
const { query } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 50); // Max 50 items per page
  const offset = (page - 1) * limit;
  
  const { category, subcategory, search, availability } = req.query;
  
  let whereConditions = ['p.active = true'];
  let queryParams = [];
  let paramIndex = 1;

  // Add filters
  if (category) {
    whereConditions.push(`c.slug = $${paramIndex}`);
    queryParams.push(category);
    paramIndex++;
  }

  if (subcategory) {
    whereConditions.push(`sc.slug = $${paramIndex}`);
    queryParams.push(subcategory);
    paramIndex++;
  }

  if (search) {
    whereConditions.push(`(p.name ILIKE $${paramIndex} OR p.short_description ILIKE $${paramIndex})`);
    queryParams.push(`%${search}%`);
    paramIndex++;
  }

  if (availability) {
    whereConditions.push(`p.availability_status = $${paramIndex}`);
    queryParams.push(availability);
    paramIndex++;
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  // Main query
  const mainQuery = `
    SELECT p.id, p.name, p.slug, p.short_description, p.base_price, p.delivery_fee,
           p.unit, p.stock_quantity, p.availability_status, p.main_image_url,
           c.name as category_name, c.slug as category_slug,
           sc.name as subcategory_name, sc.slug as subcategory_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
    ${whereClause}
    ORDER BY p.name ASC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  queryParams.push(limit, offset);

  const result = await query(mainQuery, queryParams);

  // Count query for pagination
  const countQuery = `
    SELECT COUNT(*) 
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
    ${whereClause}
  `;

  const countResult = await query(countQuery, queryParams.slice(0, -2)); // Remove limit and offset
  const totalProducts = parseInt(countResult.rows[0].count);
  const totalPages = Math.ceil(totalProducts / limit);

  res.json({
    products: result.rows,
    pagination: {
      page,
      limit,
      totalProducts,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    },
    filters: {
      category,
      subcategory,
      search,
      availability
    }
  });
}));

// @route   GET /api/products/categories
// @desc    Get all product categories with subcategories
// @access  Public
router.get('/categories', asyncHandler(async (req, res) => {
  const result = await query(`
    SELECT c.id, c.name, c.slug, c.description,
           json_agg(
             json_build_object(
               'id', sc.id,
               'name', sc.name,
               'slug', sc.slug
             ) ORDER BY sc.name
           ) FILTER (WHERE sc.id IS NOT NULL) as subcategories
    FROM categories c
    LEFT JOIN subcategories sc ON c.id = sc.category_id
    GROUP BY c.id, c.name, c.slug, c.description
    ORDER BY c.name
  `);

  res.json({
    categories: result.rows
  });
}));

// @route   GET /api/products/featured
// @desc    Get featured products (top selling or promoted)
// @access  Public
router.get('/featured', asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 12, 24);

  // For now, return products with highest stock or most recent
  // In production, you might have a featured flag or use sales data
  const result = await query(`
    SELECT p.id, p.name, p.slug, p.short_description, p.base_price, p.delivery_fee,
           p.unit, p.stock_quantity, p.availability_status, p.main_image_url,
           c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.active = true AND p.availability_status = 'available'
    ORDER BY p.stock_quantity DESC, p.created_at DESC
    LIMIT $1
  `, [limit]);

  res.json({
    products: result.rows
  });
}));

// @route   GET /api/products/search-suggestions
// @desc    Get search suggestions for autocomplete
// @access  Public
router.get('/search-suggestions', asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.length < 2) {
    return res.json({ suggestions: [] });
  }

  const result = await query(`
    SELECT DISTINCT p.name
    FROM products p
    WHERE p.name ILIKE $1 AND p.active = true
    ORDER BY p.name
    LIMIT 10
  `, [`%${q}%`]);

  res.json({
    suggestions: result.rows.map(row => row.name)
  });
}));

// @route   GET /api/products/:slug
// @desc    Get single product by slug
// @access  Public
router.get('/:slug', asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const result = await query(`
    SELECT p.*, c.name as category_name, c.slug as category_slug,
           sc.name as subcategory_name, sc.slug as subcategory_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
    WHERE p.slug = $1 AND p.active = true
  `, [slug]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      error: 'Product not found',
      code: 'PRODUCT_NOT_FOUND'
    });
  }

  const product = result.rows[0];

  // Get related products from same category
  const relatedResult = await query(`
    SELECT p.id, p.name, p.slug, p.short_description, p.base_price, 
           p.unit, p.main_image_url
    FROM products p
    WHERE p.category_id = $1 AND p.id != $2 AND p.active = true
    ORDER BY RANDOM()
    LIMIT 4
  `, [product.category_id, product.id]);

  res.json({
    product: {
      id: product.id,
      name: product.name,
      slug: product.slug,
      shortDescription: product.short_description,
      longDescription: product.long_description,
      basePrice: product.base_price,
      deliveryFee: product.delivery_fee,
      unit: product.unit,
      stockQuantity: product.stock_quantity,
      availabilityStatus: product.availability_status,
      mainImageUrl: product.main_image_url,
      galleryImages: product.gallery_images || [],
      originSource: product.origin_source,
      category: {
        name: product.category_name,
        slug: product.category_slug
      },
      subcategory: product.subcategory_name ? {
        name: product.subcategory_name,
        slug: product.subcategory_slug
      } : null,
      createdAt: product.created_at
    },
    relatedProducts: relatedResult.rows
  });
}));

// @route   POST /api/products/:id/check-availability
// @desc    Check product availability for quantity
// @access  Private (requires active subscription)
router.post('/:id/check-availability', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({
      error: 'Valid quantity required',
      code: 'INVALID_QUANTITY'
    });
  }

  // Check if user has active subscription
  const subscriptionResult = await query(`
    SELECT us.id, p.max_quantity_per_item, us.slots_used, p.slots
    FROM user_subscriptions us
    JOIN packages p ON us.package_id = p.id
    WHERE us.user_id = $1 AND us.status = 'active' 
    AND us.expires_at > CURRENT_TIMESTAMP
    ORDER BY us.created_at DESC
    LIMIT 1
  `, [req.user.id]);

  if (subscriptionResult.rows.length === 0) {
    return res.status(403).json({
      error: 'Active subscription required',
      code: 'NO_ACTIVE_SUBSCRIPTION'
    });
  }

  const subscription = subscriptionResult.rows[0];

  // Check product
  const productResult = await query(
    'SELECT stock_quantity, availability_status FROM products WHERE id = $1 AND active = true',
    [id]
  );

  if (productResult.rows.length === 0) {
    return res.status(404).json({
      error: 'Product not found',
      code: 'PRODUCT_NOT_FOUND'
    });
  }

  const product = productResult.rows[0];

  // Check availability
  if (product.availability_status !== 'available') {
    return res.json({
      available: false,
      reason: 'Product is not currently available',
      code: 'NOT_AVAILABLE'
    });
  }

  // Check stock
  if (product.stock_quantity < quantity) {
    return res.json({
      available: false,
      reason: `Only ${product.stock_quantity} units available`,
      code: 'INSUFFICIENT_STOCK',
      availableQuantity: product.stock_quantity
    });
  }

  // Check subscription limits
  if (subscription.max_quantity_per_item && quantity > subscription.max_quantity_per_item) {
    return res.json({
      available: false,
      reason: `Maximum ${subscription.max_quantity_per_item} units allowed per item for your subscription`,
      code: 'SUBSCRIPTION_LIMIT_EXCEEDED',
      maxAllowed: subscription.max_quantity_per_item
    });
  }

  res.json({
    available: true,
    message: 'Product available for requested quantity'
  });
}));

module.exports = router;