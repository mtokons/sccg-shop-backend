const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://dev2.mysccg.de', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import models with relationships
const { User, Product, Order, OrderItem } = require('./models');

// Database Connection and Sync
sequelize.authenticate()
  .then(() => {
    console.log('✅ MySQL Database Connected');
    // Sync models with database (create tables if they don't exist)
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✅ Database tables synced');
  })
  .catch(err => console.error('❌ Database Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SCCG Shop API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
