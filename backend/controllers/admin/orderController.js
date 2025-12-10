// GET all orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const { Order } = require('../../models');
    const orders = await Order.findAll();
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

// GET order by ID
exports.getOrderById = async (req, res, next) => {
  try {
    const { Order } = require('../../models');
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// POST create order
exports.createOrder = async (req, res, next) => {
  try {
    const { Order } = require('../../models');
    const { userId, status, totalAmount } = req.body;
    if (!userId || !totalAmount) {
      return res.status(400).json({ success: false, message: 'userId and totalAmount are required' });
    }
    const order = await Order.create({
      userId,
      status: status || 'pending',
      totalAmount,
    });
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// PUT update order
exports.updateOrder = async (req, res, next) => {
  try {
    const { Order } = require('../../models');
    const { id } = req.params;
    const { status, totalAmount } = req.body;
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    await order.update({
      status: status || order.status,
      totalAmount: totalAmount || order.totalAmount,
    });
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// DELETE order
exports.deleteOrder = async (req, res, next) => {
  try {
    const { Order } = require('../../models');
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    await order.destroy();
    res.json({ success: true, message: 'Order deleted' });
  } catch (err) {
    next(err);
  }
};
