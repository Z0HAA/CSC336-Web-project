const { isAuthenticated } = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
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
    
    if (!user) return res.render('admin/login', { error: 'Invalid username or password' });
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.render('admin/login', { error: 'Invalid username or password' });
    if (user.role !== 'admin') return res.render('admin/login', { error: 'Access denied' });
    
    req.session.user = { id: user._id, username: user.username, role: user.role };
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    res.render('admin/login', { error: 'Server error. Please try again.' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.error('Logout error:', err);
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

// Products List
router.get('/products', isAuthenticated, async (req, res) => {
  res.render('admin/products-list', {
    title: 'Manage Products - Admin Panel',
    page: 'products',
    layout: 'layouts/admin-layout',
    user: req.session.user,
    pageScript: 'admin-products.js'
  });
});

// Add Product
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

// Edit Product
router.get('/products/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.redirect('/admin/products');

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

// VIEW ORDERS
router.get('/orders', isAuthenticated, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.render('admin/orders', {
      title: 'Manage Orders - Admin Panel',
      page: 'orders',            // <--- Add this for sidebar active link
      layout: 'layouts/admin-layout',
      user: req.session.user,
      orders
    });
  } catch (err) {
    console.error('Admin orders error:', err);
    res.status(500).send('Something went wrong: ' + err.message);
  }
});

// UPDATE ORDER STATUS
router.post('/orders/:id/status', isAuthenticated, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).send('Order not found');

  const transitions = { Placed: 'Processing', Processing: 'Delivered', Delivered: null };
  const nextStatus = transitions[order.status];
  if (req.body.status !== nextStatus) return res.status(400).send('Invalid status transition');

  order.status = req.body.status;
  await order.save();
  res.redirect('/admin/orders');
});

module.exports = router;
