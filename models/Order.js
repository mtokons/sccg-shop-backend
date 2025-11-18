const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderNumber: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: { args: [0], msg: 'Total amount cannot be negative' }
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.ENUM('card', 'paypal', 'cod'),
    defaultValue: 'card'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'orders',
  timestamps: true,
  hooks: {
    beforeCreate: async (order) => {
      // Generate unique order number: ORD-YYYYMMDD-XXXXX
      const date = new Date();
      const dateStr = date.getFullYear() +
        String(date.getMonth() + 1).padStart(2, '0') +
        String(date.getDate()).padStart(2, '0');
      
      // Generate random 5-digit number
      const random = Math.floor(10000 + Math.random() * 90000);
      
      order.orderNumber = `ORD-${dateStr}-${random}`;
      
      // Check if order number already exists (very unlikely)
      const existing = await Order.findOne({ where: { orderNumber: order.orderNumber } });
      if (existing) {
        // If collision, add timestamp
        order.orderNumber = `ORD-${dateStr}-${random}${Date.now().toString().slice(-3)}`;
      }
    }
  }
});

module.exports = Order;
