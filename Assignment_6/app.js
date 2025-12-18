const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB Connection - REMOVED the deprecated options
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✓ MongoDB connected successfully'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Import routes
const indexRoutes = require('./routes/index');
const productsRoutes = require('./routes/products');
const crudRoutes = require('./routes/crud');

// Use routes
app.use('/', indexRoutes);
app.use('/products', productsRoutes);
app.use('/crud', crudRoutes);


// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { 
    title: '404 - Page Not Found',
    page: '404'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});