// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import express from 'express';
// import lookbookRoute from './routes/lookbook.js';
// import productRoute from './routes/product.js';
// import checkoutRoute from './routes/checkout.js';
// import customerRoute from './routes/customer.js';
// import watchPaymentStatus from './routes/watchPaymentStatus.js';

// // Start watching paymentStatus changes when the server starts

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// const uri = process.env.MONGODB_URI;
// mongoose
//   .connect(uri)
//   .then(() => {
//     console.log('MongoDB connected to dbAnmol');
//     // Start watching paymentStatus changes after the connection is established
//     watchPaymentStatus();
//   })
//   .catch((err) => console.error('MongoDB connection error:', err));

// // Routes
// app.use('/api/lookbook', lookbookRoute);
// app.use('/api/products', productRoute);
// app.use('/api/checkout', checkoutRoute);
// app.use('/api/customers', customerRoute);

// // Start server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import lookbookRoute from './routes/lookbook.js';
import productRoute from './routes/product.js';
import checkoutRoute from './routes/checkout.js';
import customerRoute from './routes/customer.js';
import  watchPaymentStatus from './routes/paymentWatcher.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,  // Limit connection pool size
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
  socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
})
.then(() => {
  console.log('MongoDB connected to dbAnmol');
  // Start watching paymentStatus changes after the connection is established
  
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  // Optional: Exit the process if database connection fails
  // process.exit(1);
});

// Routes
app.use('/api/lookbook', lookbookRoute);
app.use('/api/products', productRoute);
app.use('/api/checkout', checkoutRoute);
app.use('/api/customers', customerRoute);

// Global error handler (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  
});
setTimeout(() => {
  watchPaymentStatus();
  console.log('Payment watcher started after 4 seconds');
}, 2000);
// Graceful shutdown
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server stopped');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

export default app;