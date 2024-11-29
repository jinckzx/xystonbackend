
// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';

// const app = express();
// app.use(cors()); // Enable CORS for all routes
// const router = express.Router();

// let customersCollection;

// // Initialize MongoDB collection
// mongoose.connection.on('connected', () => {
//   const db = mongoose.connection.db;
//   customersCollection = db.collection('customers');
//   console.log('Connected to the customers collection');
// });

// // Middleware to check collection initialization
// router.use((req, res, next) => {
//   if (!customersCollection) {
//     return res.status(500).json({ error: 'Customers collection not initialized' });
//   }
//   next();
// });

// // Get all customer details
// router.get('/', async (req, res) => {
//   try {
//     const customers = await customersCollection.find().toArray();
//     if (customers.length === 0) {
//       return res.status(204).send(); // No content
//     }
//     res.json(customers);
//   } catch (err) {
//     console.error('Error fetching customers:', err);
//     res.status(500).json({ error: 'Failed to fetch customer details' });
//   }
// });
// router.get('/:identifier', async (req, res) => {
//   try {
//     const { identifier } = req.params;
//     let query;
//     if (identifier.length === 10 && /^\d+$/.test(identifier)) {
//       query = { phone: identifier };
//     } else {
//       query = { orderId: identifier };
//     }
    
//     const result = await customersCollection.findOne(query);
//     if (!result) {
//       return res.status(404).json({ error: 'Customer or order not found' });
//     }
    
//     // If result has an orders array, sort and return most recent
//     if (result.orders && result.orders.length > 0) {
//       const mostRecentOrder = result.orders.reduce((latest, current) => 
//         new Date(current.createdAt) < new Date(latest.createdAt) ? current : latest
//       );
//       return res.json(mostRecentOrder);
//     }
    
//     res.json(result);
//   } catch (error) {
//     console.error('Error fetching customer/order details:', error);
//     res.status(500).json({ error: 'Failed to fetch customer/order details' });
//   }
// });

// export default router;

// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';

// const app = express();
// app.use(cors()); // Enable CORS for all routes
// const router = express.Router();

// let customersCollection;

// // Initialize MongoDB collection
// mongoose.connection.on('connected', () => {
//   const db = mongoose.connection.db;
//   customersCollection = db.collection('customers');
//   console.log('Connected to the customers collection');
// });

// // Middleware to check collection initialization
// router.use((req, res, next) => {
//   if (!customersCollection) {
//     return res.status(500).json({ error: 'Customers collection not initialized' });
//   }
//   next();
// });

// // Get all customer details
// router.get('/', async (req, res) => {
//   try {
//     const customers = await customersCollection.find().toArray();
//     if (customers.length === 0) {
//       return res.status(204).send(); // No content
//     }
//     res.json(customers);
//   } catch (err) {
//     console.error('Error fetching customers:', err);
//     res.status(500).json({ error: 'Failed to fetch customer details' });
//   }
// });

// // Get the most recent order by phone or orderId
// router.get('/:identifier', async (req, res) => {
//   try {
//     const { identifier } = req.params;
//     let query;

//     // Identify query type: phone number or orderId
//     if (identifier.length === 10 && /^\d+$/.test(identifier)) {
//       query = { phone: identifier };
//     } else {
//       query = { orderId: identifier };
//     }

//     // Fetch the customer document
//     const customer = await customersCollection.findOne(query);
//     if (!customer) {
//       return res.status(404).json({ error: 'Customer or order not found' });
//     }

//     // If `orders` array exists, sort by `createdAt` in descending order and return the most recent
//     if (customer.orders && customer.orders.length > 0) {
//       const sortedOrders = customer.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//       return res.json(sortedOrders[0]); // Return the most recent order
//     }

//     // If no `orders` array, return the customer document
//     res.json(customer);
//   } catch (error) {
//     console.error('Error fetching customer/order details:', error);
//     res.status(500).json({ error: 'Failed to fetch customer/order details' });
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

// Get the most recent entry by phone or orderId
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let query;

    // Identify query type: phone number or orderId
    if (identifier.length === 10 && /^\d+$/.test(identifier)) {
      query = { phone: identifier };
    } else {
      query = { orderId: identifier };
    }

    // Fetch the most recent customer document sorted by `createdAt` in descending order
    const mostRecentCustomer = await customersCollection.findOne(query, {
      sort: { createdAt: -1 }, // Sort by createdAt in descending order
    });

    if (!mostRecentCustomer) {
      return res.status(404).json({ error: 'Customer or order not found' });
    }

    res.json(mostRecentCustomer); // Return the most recent document
  } catch (error) {
    console.error('Error fetching customer/order details:', error);
    res.status(500).json({ error: 'Failed to fetch customer/order details' });
  }
});

export default router;
