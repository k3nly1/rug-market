const express = require('express');
const { sequelize } = require('../config/db');
const adminRoutes = require('./admin');

const router = express.Router();

// Health check endpoint
router.get('/ping', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

// DB connection check endpoint
router.get('/ping-db', async (req, res, next) => {
  try {
    await sequelize.authenticate();
    res.json({ success: true, message: 'Database connection is OK' });
  } catch (err) {
    res.status(503).json({ success: false, message: 'Database connection failed', error: err.message });
  }
});

// Mount admin routes at /api/admin
router.use('/admin', adminRoutes);

module.exports = router;
