export const orderConfirmationTemplate = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      border-radius: 5px;
    }
    .order-details {
      margin: 20px 0;
      padding: 20px;
      border: 1px solid #dee2e6;
      border-radius: 5px;
    }
    .item {
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }
    .item:last-child {
      border-bottom: none;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #dee2e6;
      color: #6c757d;
    }
    .logo {
      max-width: 150px;
      margin-bottom: 15px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Confirmation</h1>
      <p>Thank you for your purchase!</p>
    </div>
    
    <div class="order-details">
      <h2>Hello {{name}},</h2>
      <p>Your order (Order ID: {{orderId}}) has been confirmed and is being processed.</p>
      
      <h3>Order Summary:</h3>
      {{#each orderItems}}
      <div class="item">
        <img src="{{this.image}}" alt="{{this.name}}" style="max-width: 100px; height: auto;">
        <h4>{{this.name}}</h4>
        <p>Price: ₹{{this.price}}</p>
        <p>Quantity: {{this.quantity}}</p>
        <p>Size: {{this.size}}</p>
      </div>
      {{/each}}
    </div>

    <div class="footer">
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>Best Regards,<br>Too Far Gone Team</p>
    </div>
  </div>
</body>
</html>
`;