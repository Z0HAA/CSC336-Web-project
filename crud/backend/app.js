const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // to allow frontend calls

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/betattoo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String
});

const Product = mongoose.model('Product', ProductSchema);

// CRUD routes
app.get('/api/products', async (req, res) => res.json(await Product.find()));

app.get('/api/products/:id', async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({message:'Not found'});
  res.json(p);
});

app.post('/api/products', async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

app.put('/api/products/:id', async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, {new:true});
  if (!p) return res.status(404).json({message:'Not found'});
  res.json(p);
});

app.delete('/api/products/:id', async (req, res) => {
  const p = await Product.findByIdAndDelete(req.params.id);
  if (!p) return res.status(404).json({message:'Not found'});
  res.status(204).end();
});

// Start server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
