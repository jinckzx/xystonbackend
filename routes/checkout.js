// import express from 'express';
// import Razorpay from 'razorpay';
// import mongoose from 'mongoose';
// import crypto from 'crypto';
// import dotenv from 'dotenv';

// dotenv.config();  // This loads the environment variables from the .env file

// const router = express.Router();

// // Initialize Razorpay
// const razorpay = new Razorpay({
//   key_id: process.env.YOUR_KEY_ID,
//   key_secret: process.env.YOUR_KEY_SECRET
// });

// // MongoDB connection using URI from environment variable
// const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/xyston'; // Fallback to localhost if not defined in .env
// mongoose.connect(mongoURI, { useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // Access existing 'customers' collection without defining a new schema
// const Customer = mongoose.model('customers',schema); // 'customers' is the collection name

// // Route to create an order
// router.post('/create-order', async (req, res) => {
//   try {
//     const { formData, cartItems, totalAmount } = req.body;

//     // Create Razorpay order
//     const razorpayOrder = await razorpay.orders.create({
//       amount: Math.round(totalAmount * 100), // Convert to paise
//       currency: 'INR',
//       payment_capture: 1
//     });

//     // Generate unique order ID
//     const orderId = 'ORD' + Date.now() + Math.random().toString(36).substring(7);

//     // Create customer record
//     const customer = new Customer({
//       orderId,
//       razorpayOrderId: razorpayOrder.id,
//       name: formData.name,
//       email: formData.email,
//       phone: formData.phone,
//       address: formData.address,
//       city: formData.city,
//       state: formData.state,
//       pincode: formData.pincode,
//       paymentMethod: 'razorpay',
//       orderItems: cartItems,
//       totalAmount,
//       paymentStatus: 'pending',
//       orderStatus: 'pending'
//     });

//     await customer.save();

//     res.json({
//       orderId,
//       razorpayOrderId: razorpayOrder.id,
//       amount: razorpayOrder.amount,
//       currency: razorpayOrder.currency,
//       keyId: process.env.YOUR_KEY_ID
//     });
//   } catch (error) {
//     console.error('Order creation error:', error);
//     res.status(500).json({ error: 'Failed to create order' });
//   }
// });

// // Route to verify the payment
// router.post('/verify-payment', async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     // Verify signature
//     const sign = razorpay_order_id + '|' + razorpay_payment_id;
//     const expectedSign = crypto
//       .createHmac('sha256', process.env.YOUR_KEY_SECRET)
//       .update(sign)
//       .digest('hex');

//     if (razorpay_signature === expectedSign) {
//       // Update order status
//       await Customer.findOneAndUpdate(
//         { razorpayOrderId: razorpay_order_id },
//         { 
//           paymentStatus: 'completed',
//           orderStatus: 'processing'
//         }
//       );

//       res.json({ success: true });
//     } else {
//       res.status(400).json({ error: 'Invalid signature' });
//     }
//   } catch (error) {
//     console.error('Payment verification error:', error);
//     res.status(500).json({ error: 'Payment verification failed' });
//   }
// });

// export default router;

import express from 'express';
import Razorpay from 'razorpay';
import mongoose from 'mongoose';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.YOUR_KEY_ID,
  key_secret: process.env.YOUR_KEY_SECRET
});

// MongoDB connection using URI from environment variable
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/xyston'; // Fallback to localhost if not defined in .env
mongoose.connect(mongoURI, { useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Access existing 'customers' collection without defining a new schema
const Customer = mongoose.model('customers', new mongoose.Schema({}, { strict: false })); // Use an empty schema for existing collection

// Route to create an order
router.post('/create-order', async (req, res) => {
  try {
    const { formData, cartItems, totalAmount } = req.body;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // Convert to paise
      currency: 'INR',
      payment_capture: 1
    });

    // Generate unique order ID
    const orderId = 'ORD' + Date.now() + Math.random().toString(36).substring(7);

    // Create customer record
      const customer = new Customer({
        orderId,
        razorpayOrderId: razorpayOrder.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        paymentMethod: 'razorpay',
        orderItems: cartItems,
        totalAmount,
        paymentStatus: 'pending',
        orderStatus: 'pending',
        createdAt: new Date()
      });

    await customer.save();

    res.json({
      orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.YOUR_KEY_ID
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Route to verify the payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.YOUR_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Update order status
      await Customer.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { 
          paymentStatus: 'completed',
          orderStatus: 'processing'
        }
      );

      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

export default router;