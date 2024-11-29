
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Ensure the products collection is initialized
let productsCollection;
mongoose.connection.on('connected', () => {
  const db = mongoose.connection.db;
  productsCollection = db.collection('products'); // The collection name in your database
});

// Get all products
router.get('/', async (req, res) => {
  try {
    if (!productsCollection) {
      return res.status(500).json({ error: 'Products collection not initialized' });
    }

    const products = await productsCollection.find().toArray();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get a product by productId
router.get('/:productId', async (req, res) => {
  try {
    if (!productsCollection) {
      return res.status(500).json({ error: 'Products collection not initialized' });
    }

    const productId = req.params.productId;
    const product = await productsCollection.findOne({ productId });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

export default router;
