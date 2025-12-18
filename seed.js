const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const products = [
  {
    name: 'Basic Tattoo',
    description: 'Simple and small – ideal for first-timers',
    price: 80,
    category: 'Basic',
    image: '/assets/img1.jpg',
    inStock: true,
    featured: false
  },
  {
    name: 'Mini Symbol Tattoo',
    description: 'Tiny symbol or letter design',
    price: 60,
    category: 'Basic',
    image: '/assets/img2.jpg',
    inStock: true,
    featured: false
  },
  {
    name: 'Standard Tattoo',
    description: 'Medium-sized design with more detail',
    price: 150,
    category: 'Standard',
    image: '/assets/img9.jpg',
    inStock: true,
    featured: true
  },
  {
    name: 'Floral Design',
    description: 'black and white florals',
    price: 180,
    category: 'Standard',
    image: '/assets/kev.png',
    inStock: true,
    featured: false
  },
  {
    name: 'Geometric Art',
    description: 'Modern geometric patterns and shapes',
    price: 200,
    category: 'Standard',
    image: '/assets/img4.jpg',
    inStock: true,
    featured: true
  },
  {
    name: 'Premium Tattoo',
    description: 'Full detail, custom large tattoo art',
    price: 250,
    category: 'Premium',
    image: '/assets/img6.jpg',
    inStock: true,
    featured: true
  },
  {
    name: 'Sleeve Tattoo',
    description: 'Full or half sleeve custom design',
    price: 400,
    category: 'Premium',
    image: '/assets/top.jpg',
    inStock: true,
    featured: false
  },
  {
    name: 'Back Piece',
    description: 'Large detailed back tattoo masterpiece',
    price: 500,
    category: 'Premium',
    image: '/assets/i1.jpg',
    inStock: true,
    featured: true
  },
  {
    name: 'Custom Portrait',
    description: 'Realistic portrait tattoo of your choice',
    price: 350,
    category: 'Custom',
    image: '/assets/img7.jpg',
    inStock: true,
    featured: false
  },
  {
    name: 'Watercolor Design',
    description: 'Artistic watercolor style tattoo',
    price: 220,
    category: 'Custom',
    image: '/assets/img5.jpg',
    inStock: false,
    featured: false
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    await Product.deleteMany({});
    console.log('✓ Cleared existing products');

    const result = await Product.insertMany(products);
    console.log(`✓ Inserted ${result.length} products:`);
    result.forEach(p => console.log(`  - ${p.name}: $${p.price} (${p.category})`));

    console.log('\n✓ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seedDatabase();