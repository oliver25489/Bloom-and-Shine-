const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configure email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Order endpoint
app.post('/api/orders', async (req, res) => {
  try {
    const { firstName, secondName, phone, email, city, town, address1, address2, quantity, price } = req.body;

    // Validate
    if (!firstName || !secondName || !phone || !email || !city || !town || !address1 || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const totalPrice = price * quantity;
    const orderId = Date.now();

    // Email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Order Confirmation - Bloom&Shine Hair Oil',
      html: `
        <h2>Thank you for your order!</h2>
        <p>Hi ${firstName} ${secondName},</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Product:</strong> Bloom&Shine Hair Oil (${quantity}x)</p>
        <p><strong>Total Price:</strong> Kshs${totalPrice}</p>
        <p><strong>Shipping Address:</strong></p>
        <p>${address1}<br />
           ${address2 ? address2 + '<br />' : ''}
           ${town}, ${city}</p>
        <p><strong>Contact:</strong> ${phone}</p>
        <p>We'll ship your order within 2-3 business days and send you a tracking number.</p>
        <p>Thank you for supporting Bloom&Shine!</p>
      `,
    });

    // Email to owner
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Order - ${firstName} ${secondName}`,
      html: `
        <h3>New Order Received!</h3>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer:</strong> ${firstName} ${secondName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Total:</strong> Kshs${totalPrice}</p>
        <p><strong>Address:</strong> ${address1}, ${address2 || ''} ${town}, ${city}</p>
      `,
    });

    res.json({ success: true, orderId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process order' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Bloom&Shine API running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});