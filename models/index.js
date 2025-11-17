const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Define all relationships here to avoid circular dependencies
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Order, { foreignKey: 'userId' });

OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
Product.hasMany(OrderItem, { foreignKey: 'productId' });

module.exports = {
  User,
  Product,
  Order,
  OrderItem
};
