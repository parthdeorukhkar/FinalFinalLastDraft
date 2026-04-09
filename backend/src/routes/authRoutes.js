const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', protect, authController.getMe);
router.put('/update-profile', protect, authController.updateProfile);
router.put('/change-password', protect, authController.changePassword);

// Admin only routes
router.post('/register-admin', protect, authorize('admin'), authController.registerAdmin);
router.get('/admins', protect, authorize('admin'), authController.getAllAdmins);

module.exports = router;
