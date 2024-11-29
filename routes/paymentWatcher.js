
// import mongoose from 'mongoose';
// import { sendConfirmationEmail } from './emailService.js';

// // Function to watch payment status changes
// export function watchPaymentStatus() {
//   // Replace `Customer` with your actual Mongoose model name for customers
//   const customerCollection = mongoose.model('customers').collection;

//   const changeStream = customerCollection.watch();

//   changeStream.on('change', async (change) => {
//     if (change.operationType === 'update') {
//       const { updateDescription, documentKey } = change;
//       const updatedFields = updateDescription.updatedFields;

//       // Check if paymentStatus is updated to 'completed'
//       if (updatedFields.paymentStatus === 'completed') {
//         try {
//           const customer = await customerCollection.findOne({ _id: documentKey._id });
//           if (customer) {
//             await sendConfirmationEmail(
//               customer.email,
//               customer.name,
//               customer.orderId,
//               customer.orderItems
//             );
//             console.log(`Email sent to ${customer.email} for Order ID ${customer.orderId}`);
//           } else {
//             console.warn(`Customer with ID ${documentKey._id} not found`);
//           }
//         } catch (err) {
//           console.error('Error processing payment status change:', err);
//         }
//       }
//     }
//   });

//   console.log('Started watching paymentStatus changes...');
// }
import mongoose from 'mongoose';
import { sendConfirmationEmail } from './emailService.js';

async function watchPaymentStatus() {
  try {
    console.log('Connecting to the customers collection...');
    
    const customerCollection = mongoose.connection.collection('customers');
    
    if (!customerCollection.watch) {
      throw new Error(
        'The watch method is not available. Ensure you are connected to a replica set or sharded cluster.'
      );
    }

    console.log('Connected to the customers collection, setting up change stream...');
    
    const changeStream = customerCollection.watch();
    
    if (!changeStream || typeof changeStream.on !== 'function') {
      throw new Error('changeStream is not valid. Ensure MongoDB supports change streams.');
    }

    changeStream.on('change', async (change) => {
      if (change.operationType === 'update') {
        const { updateDescription, documentKey } = change;
        const updatedFields = updateDescription.updatedFields;

        if (updatedFields.paymentStatus === 'completed') {
          try {
            const customer = await customerCollection.findOne({ _id: documentKey._id });
            if (customer) {
              await sendConfirmationEmail(
                customer.email,
                customer.name,
                customer.orderId,
                customer.orderItems
              );
              console.log(`Email sent to ${customer.email} for Order ID ${customer.orderId}`);
            } else {
              console.warn(`Customer with ID ${documentKey._id} not found`);
            }
          } catch (err) {
            console.error('Error processing payment status change:', err);
          }
        }
      }
    });

    console.log('Started watching paymentStatus changes...');
  } catch (error) {
    console.error('Error setting up change stream:', error);
  }
}

export default watchPaymentStatus;
