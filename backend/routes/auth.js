const express = require('express');
const authController = require('../controllers/authController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// ========== ПУБЛІЧНІ МАРШРУТИ ==========
router.post('/register', authController.register);
router.post('/login', authController.login);

// ========== ЗАХИЩЕНІ МАРШРУТИ ==========
router.get('/profile', verifyToken, authController.getProfile);
router.post('/change-password', verifyToken, authController.changePassword);
router.post('/logout', verifyToken, authController.logout);

module.exports = router;
