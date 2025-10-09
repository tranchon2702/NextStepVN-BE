const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateJWT, isAdmin } = require('../middleware/auth');

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return token
 * @access  Public
 * @body    { username, password }
 */
router.post('/login', authController.login);

/**
 * @route   GET /api/auth/verify
 * @desc    Verify token is valid
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.get('/verify', authenticateJWT, authController.verify);

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (admin only)
 * @access  Private/Admin
 * @body    { username, password, name, role }
 * @header  Authorization: Bearer <token>
 */
router.post('/register', authenticateJWT, isAdmin, authController.register);

module.exports = router; 