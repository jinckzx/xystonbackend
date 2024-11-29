// backend/routes/lookbook.js
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Define the API endpoint to get all lookbook posts
router.get('/', async (req, res) => {
  try {
    const lookbookPosts = await mongoose.connection.db.collection('lookbook').find().toArray();
    res.json(lookbookPosts);
  } catch (err) {
    console.error('Error fetching lookbook posts:', err);
    res.status(500).send('Server error');
  }
});

export default router; // Correct export for ES Modules
