const { isAuthenticated } = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');


// Login Page (GET)
router.get('/login', (req, res) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login', { error: null });
});

// Login Submit (POST)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      return res.render('admin/login', { error: 'Invalid username or password' });
    }
    
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.render('admin/login', { error: 'Invalid username or password' });
    }
    
    if (user.role !== 'admin') {
      return res.render('admin/login', { error: 'Access denied' });
    }
    
    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role
    };
    
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    res.render('admin/login', { error: 'Server error. Please try again.' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/admin/login');
  });
});

// ==== PROTECTED ROUTES ====

// Admin Dashboard
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const inStockProducts = await Product.countDocuments({ inStock: true });
    const featuredProducts = await Product.countDocuments({ featured: true });
    
    const products = await Product.find();
    const totalValue = products.reduce((sum, p) => sum + p.price, 0);

    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.render('admin/dashboard', {
      title: 'Dashboard - Admin Panel',
      page: 'dashboard',
      layout: 'layouts/admin-layout',
      user: req.session.user,
      stats: {
        total: totalProducts,
        inStock: inStockProducts,
        featured: featuredProducts,
        totalValue: totalValue.toFixed(2)
      },
      categoryStats
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).send('Server error');
  }
});

// Products List Page
router.get('/products', isAuthenticated, async (req, res) => {
  res.render('admin/products-list', {
    title: 'Manage Products - Admin Panel',
    page: 'products',
    layout: 'layouts/admin-layout',
    user: req.session.user,
    pageScript: 'admin-products.js'
  });
});

// Add Product Page
router.get('/products/add', isAuthenticated, (req, res) => {
  res.render('admin/product-form', {
    title: 'Add Product - Admin Panel',
    page: 'add-product',
    layout: 'layouts/admin-layout',
    user: req.session.user,
    product: null,
    action: 'add',
    pageScript: 'admin-products.js'
  });
});

// Edit Product Page
router.get('/products/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    
    if (!product) {
      return res.redirect('/admin/products');
    }

    res.render('admin/product-form', {
      title: 'Edit Product - Admin Panel',
      page: 'products',
      layout: 'layouts/admin-layout',
      user: req.session.user,
      product,
      action: 'edit',
      pageScript: 'admin-products.js'
    });
  } catch (err) {
    console.error('Edit product error:', err);
    res.redirect('/admin/products');
  }
});

// ==== API ENDPOINTS ====

// GET all products (API)
router.get('/api/products', isAuthenticated, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    console.error('API Get products error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single product (API)
router.get('/api/products/:id', isAuthenticated, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (err) {
    console.error('API Get product error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// CREATE product (API)
router.post('/api/products', isAuthenticated, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ success: true, product, message: 'Product added successfully' });
  } catch (err) {
    console.error('API Create product error:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// UPDATE product (API)
router.put('/api/products/:id', isAuthenticated, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, product, message: 'Product updated successfully' });
  } catch (err) {
    console.error('API Update product error:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE product (API)
router.delete('/api/products/:id', isAuthenticated, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    console.error('API Delete product error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;