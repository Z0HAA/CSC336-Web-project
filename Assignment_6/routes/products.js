const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Product listing page
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 9);
    const category = req.query.category || '';
    const priceMin = parseFloat(req.query.priceMin) || 0;
    const priceMax = parseFloat(req.query.priceMax) || 0;

    // Build filter
    const filter = {};
    if (category) filter.category = category;
    if (priceMin) filter.price = { ...filter.price, $gte: priceMin };
    if (priceMax > 0) filter.price = { ...filter.price, $lte: priceMax };

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get unique categories for filter
    const categories = await Product.distinct('category');

    res.render('products/index', {
      title: 'BeTattoo - Products',
      page: 'products',
      products,
      currentPage: page,
      totalPages,
      limit,
      total,
      categories,
      query: req.query
    });
  } catch (err) {
    console.error('Products route error:', err);
    res.status(500).send('Server error loading products');
  }
});

// Single product view
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    
    if (!product) {
      return res.status(404).render('404', {
        title: '404 - Product Not Found',
        page: 'products'
      });
    }

    res.render('products/view', {
      title: `${product.name} - BeTattoo`,
      page: 'products',
      product
    });
  } catch (err) {
    console.error('Product view error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;