import { createTransporter } from './emailTransporter.js';
import { orderConfirmationTemplate } from './orderConfirmation.js';
import Handlebars from 'handlebars';

export async function sendConfirmationEmail(email, name, orderId, orderItems) {
  try {
    const transporter = await createTransporter();
    
    // Compile the template with Handlebars
    const template = Handlebars.compile(orderConfirmationTemplate);
    const htmlContent = template({
      name,
      orderId,
      orderItems
    });

    const mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: email,
      subject: `Payment Confirmed - Order Receipt (${orderId})`,
      html: htmlContent,
      text: `Hello ${name},\n\nYour payment for Order ID ${orderId} has been confirmed. Thank you for shopping with us!\n\nBest Regards, Too Far Gone!`
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${email}`);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}