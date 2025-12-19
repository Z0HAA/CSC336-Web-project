const Order = require('../models/Order');
const express = require('express');
const router = express.Router();
const applyDiscount = require('../middleware/applyDiscount');

// Order Preview
router.post('/order/preview', applyDiscount, (req, res) => {
  const cart = JSON.parse(req.body.items || "[]");
  const customer = JSON.parse(req.body.customer || "{}");
  const subtotal = parseFloat(req.body.subtotal) || 0;
  const discount = req.discount || { code: null, amount: 0 };
  const total = req.finalTotal || subtotal;

  res.render('order-preview', {
    cart,
    customer,
    subtotal,
    discount,
    total,
    title: 'Order Preview'
  });
});

// Confirm Order
router.post('/order/confirm', applyDiscount, async (req, res) => {
  const order = new Order({
    customer: JSON.parse(req.body.customer || '{}'),
    items: JSON.parse(req.body.items || '[]'),
    subtotal: parseFloat(req.body.subtotal) || 0,
    discount: req.discount || { code: null, amount: 0 },
    total: req.finalTotal || parseFloat(req.body.subtotal) || 0,
    status: 'Placed'
  });

  await order.save();
  res.redirect(`/ordersplaced?id=${order._id}`);
});

// Customer Order History
router.get('/my-orders', async (req, res) => {
  try {
    const email = req.query.email;
    let orders = [];

    if (email) {
      orders = await Order.find({ 'customer.email': email }).sort({ createdAt: -1 });
    }

    res.render('my-orders', { 
      orders,
      email,
      title: 'My Orders',  // Add title
      page: 'my-orders'    // Add page for layout sidebar (if needed)
    });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).send('Something went wrong: ' + err.message);
  }
});

module.exports = router;
