// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';

// const app = express();
// app.use(cors()); // Enable CORS for all routes
// const router = express.Router();

// // Ensure the costumers collection is initialized
// let costumersCollection;
// mongoose.connection.on('connected', () => {
//   const db = mongoose.connection.db;
//   costumersCollection = db.collection('customers'); // The collection name in your database
// });
// // Get all customers details
// router.get('/', async (req, res) => {
//   try {
//     if (!costumersCollection) {
//       return res.status(500).json({ error: 'Orders collection not initialized' });
//     }

//     const products = await costumersCollection.find().toArray();
//     res.json(products);
//   } catch (err) {
//     console.error('Error fetching order:', err);
//     res.status(500).json({ error: 'Failed to fetch order details' });
//   }
// });
// // Route to get order details by order ID

// router.get('/:orderId', async (req, res) => {
//   try {
//     if (!costumersCollection) {
//       return res.status(500).json({ error: 'Orders collection not initialized' });
//     }

//     const orderId = req.params.orderId;
//     const order = await costumersCollection.findOne({ orderId });

   







//     if (!order) {
//       return res.status(404).json({ error: 'Order not found' });
//     }

//     res.json(customer);
//   } catch (error) {
//     console.error('Error fetching order details:', error);
//     res.status(500).json({ error: 'Failed to fetch order details' });
//   }
// });

// export default router;
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';


const app = express();
app.use(cors()); // Enable CORS for all routes
const router = express.Router();

let customersCollection;

// Initialize MongoDB collection
mongoose.connection.on('connected', () => {
  const db = mongoose.connection.db;
  customersCollection = db.collection('customers');
  console.log('Connected to the customers collection');
  
});

// Middleware to check collection initialization
router.use((req, res, next) => {
  if (!customersCollection) {
    return res.status(500).json({ error: 'Customers collection not initialized' });
  }
  next();
});

// Get all customer details
router.get('/', async (req, res) => {
  try {
    const customers = await customersCollection.find().toArray();
    if (customers.length === 0) {
      return res.status(204).send(); // No content
    }
    res.json(customers);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ error: 'Failed to fetch customer details' });
  }
});

// Get customer details by order ID
router.get('/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await customersCollection.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

export default router;
