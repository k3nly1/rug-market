const { sequelize } = require('../config/db');
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const Category = require('./Category');

// Define associations if needed
// User.hasMany(Order, { foreignKey: 'userId' });
// Order.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Product,
  Order,
  Category,
};
