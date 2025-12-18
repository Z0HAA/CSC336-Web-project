const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');

// Login Page (GET)
router.get('/login', (req, res) => {
  // If already logged in, redirect to dashboard
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login', { error: null });
});

// Login Submit (POST)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user in database
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      return res.render('admin/login', { error: 'Invalid username or password' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.render('admin/login', { error: 'Invalid username or password' });
    }
    
    // Check if user is admin
    if (user.role !== 'admin') {
      return res.render('admin/login', { error: 'Access denied' });
    }
    
    // Store user info in session
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

// ==== PROTECTED ROUTES (require login) ====

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

// List All Products
router.get('/products', isAuthenticated, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();

    res.render('admin/products-list', {
      title: 'Manage Products - Admin Panel',
      page: 'products',
      layout: 'layouts/admin-layout',
      user: req.session.user,
      products,
      query: req.query
    });
  } catch (err) {
    console.error('Products list error:', err);
    res.status(500).send('Server error');
  }
});

// Add Product Form
router.get('/products/add', isAuthenticated, (req, res) => {
  res.render('admin/product-form', {
    title: 'Add Product - Admin Panel',
    page: 'add-product',
    layout: 'layouts/admin-layout',
    user: req.session.user,
    product: null,
    action: 'add'
  });
});

// Create Product
router.post('/products/add', isAuthenticated, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.redirect('/admin/products?success=added');
  } catch (err) {
    console.error('Add product error:', err);
    res.redirect('/admin/products/add?error=failed');
  }
});

// Edit Product Form
router.get('/products/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    
    if (!product) {
      return res.redirect('/admin/products?error=notfound');
    }

    res.render('admin/product-form', {
      title: 'Edit Product - Admin Panel',
      page: 'products',
      layout: 'layouts/admin-layout',
      user: req.session.user,
      product,
      action: 'edit'
    });
  } catch (err) {
    console.error('Edit product error:', err);
    res.redirect('/admin/products?error=failed');
  }
});

// Update Product
router.post('/products/edit/:id', isAuthenticated, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.redirect('/admin/products?success=updated');
  } catch (err) {
    console.error('Update product error:', err);
    res.redirect(`/admin/products/edit/${req.params.id}?error=failed`);
  }
});

// Delete Product
router.post('/products/delete/:id', isAuthenticated, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/products?success=deleted');
  } catch (err) {
    console.error('Delete product error:', err);
    res.redirect('/admin/products?error=failed');
  }
});

module.exports = router;