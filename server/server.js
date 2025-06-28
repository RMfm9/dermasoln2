// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config');
const cleanOldOrders = require('./utils/cleanOldOrders');

dotenv.config(); // Load .env variables

connectDB(); // Connect to MongoDB

const app = express();

// Allowed origins (local + deployed)
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'https://dermasoln2.vercel.app' // ✅ Update with your actual frontend Vercel URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS error: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type']
}));

app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// ⏳ Clean old orders every 24 hours
setInterval(cleanOldOrders, 24 * 60 * 60 * 1000);

// 🌍 Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientPath));

  // Serve index.html for all unmatched routes (except API)
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientPath, 'index.html'));
    }
  });
}

// ✅ Ensure app binds to 0.0.0.0 for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
