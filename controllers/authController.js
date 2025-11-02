const jwt = require('jsonwebtoken');
const { User } = require('../models');

class AuthController {
  /**
   * Login user
   * @route POST /api/auth/login
   * @access Public
   */
  async login(req, res) {
    try {
      const { username, password } = req.body;

      console.log('Login attempt:', { username: username?.trim(), hasPassword: !!password });

      // Validate input
      if (!username || !password) {
        console.log('Missing credentials');
        return res.status(400).json({
          success: false,
          message: 'Username and password are required'
        });
      }

      // Normalize username (trim whitespace)
      const normalizedUsername = username.trim();
      
      // Find user by username (exact match, case-sensitive to match how it was saved)
      const user = await User.findOne({ username: normalizedUsername });

      console.log('User search:', {
        searchFor: normalizedUsername,
        found: !!user,
        userInfo: user ? { 
          username: user.username, 
          isActive: user.isActive,
          role: user.role
        } : null
      });

      if (!user) {
        console.log('User not found with username:', normalizedUsername);
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        console.log('User account is deactivated');
        return res.status(403).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      console.log('Password match:', isMatch);

      if (!isMatch) {
        console.log('Password does not match');
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Update last login time
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during login',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Verify token
   * @route GET /api/auth/verify
   * @access Private
   */
  async verify(req, res) {
    try {
      res.json({
        success: true,
        user: req.user
      });
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during verification'
      });
    }
  }

  /**
   * Register a new user (admin only)
   * @route POST /api/auth/register
   * @access Private/Admin
   */
  async register(req, res) {
    try {
      const { username, password, name, role } = req.body;

      // Validate input
      if (!username || !password || !name) {
        return res.status(400).json({
          success: false,
          message: 'Username, password, and name are required'
        });
      }

      // Check if requesting user is an admin (role checking handled in route middleware)

      // Check if username exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists'
        });
      }

      // Create new user
      const user = new User({
        username,
        password,
        name,
        role: role || 'admin'
      });

      await user.save();

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during registration',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Create initial admin user if none exists
   * Used internally during server startup
   */
  async createInitialAdmin() {
    try {
      const adminCount = await User.countDocuments({ role: 'admin' });

      if (adminCount === 0) {
        // Create a default admin user
        const defaultAdmin = new User({
          username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
          password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123',
          name: 'System Administrator',
          role: 'admin'
        });

        await defaultAdmin.save();
        console.log('Initial admin user created');
      }
    } catch (error) {
      console.error('Error creating initial admin:', error);
    }
  }
}

module.exports = new AuthController(); 