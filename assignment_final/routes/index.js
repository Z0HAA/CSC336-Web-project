const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Home page
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'BeTattoo - Home',
    page: 'home'
  });
});

// Process page
router.get('/process', (req, res) => {
  res.render('process', { 
    title: 'BeTattoo - Process',
    page: 'process'
  });
});

// Tattoos page
router.get('/tattoo', (req, res) => {
  res.render('tattoo', { 
    title: 'BeTattoo - Tattoos',
    page: 'tattoo'
  });
});

// Studio page
router.get('/studio', (req, res) => {
  res.render('studio', { 
    title: 'BeTattoo - Our Studio',
    page: 'studio'
  });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('contact', { 
    title: 'BeTattoo - Contact Us',
    page: 'contact'
  });
});

// Buy Now page - WITH PAGINATION & FILTERS
router.get('/buy-now', async (req, res) => {
  try {
    // Parse query parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 9);
    const category = req.query.category || '';
    const priceMin = parseFloat(req.query.priceMin) || 0;
    const priceMax = parseFloat(req.query.priceMax) || 0;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (priceMin) filter.price = { ...filter.price, $gte: priceMin };
    if (priceMax > 0) filter.price = { ...filter.price, $lte: priceMax };

    // Get total count and calculate pagination
    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    // Fetch products with filters and pagination
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get unique categories for filter dropdown
    const categories = await Product.distinct('category');

    console.log('========== BUY NOW DEBUG ==========');
    console.log('Page:', page, '| Limit:', limit);
    console.log('Filters:', filter);
    console.log('Products found:', products.length, 'of', total);
    console.log('===================================');
    
    res.render('buy-now', { 
      title: 'BeTattoo - Buy Now',
      page: 'buy-now',
      products: products,
      currentPage: page,
      totalPages: totalPages,
      limit: limit,
      total: total,
      categories: categories,
      query: req.query
    });
  } catch (err) {
    console.error('========== ERROR FETCHING PRODUCTS ==========');
    console.error('Error:', err);
    console.error('=============================================');
    // Fallback
    res.render('buy-now', { 
      title: 'BeTattoo - Buy Now',
      page: 'buy-now',
      products: [],
      currentPage: 1,
      totalPages: 1,
      limit: 9,
      total: 0,
      categories: [],
      query: {}
    });
  }
});

// Cart page
router.get('/cart', (req, res) => {
  res.render('cart', { 
    title: 'BeTattoo - Shopping Cart',
    page: 'cart'
  });
});

// Checkout page
router.get('/checkout', (req, res) => {
  res.render('checkoutt', { 
    title: 'BeTattoo - Checkout',
    page: 'checkout'
  });
});

// Order placed confirmation
router.get('/ordersplaced', (req, res) => {
  res.render('ordersplaced', { 
    title: 'BeTattoo - Order Confirmed',
    page: 'ordersplaced'
  });
});

// CRUD Demo page
router.get('/crud', (req, res) => {
  res.render('crud', { 
    title: 'BeTattoo - CRUD Demo',
    page: 'crud'
  });
});

module.exports = router;