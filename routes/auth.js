const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { OAuth2Client } = require('google-auth-library');

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClient = googleClientId ? new OAuth2Client(googleClientId) : null;

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      provider: 'local'
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          provider: user.provider,
          token: generateToken(user.id)
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider,
        token: generateToken(user.id)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/auth/google
// @desc    Login/Register user with Google OAuth
// @access  Public
router.post('/google', async (req, res) => {
  try {
    if (!googleClient) {
      return res.status(500).json({
        success: false,
        message: 'Google OAuth is not configured on the server.'
      });
    }

    const { token } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Google token is required'
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: googleClientId
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Unable to verify Google token');
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      throw new Error('Google account email is required');
    }

    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: null,
        provider: 'google',
        googleId
      });
    } else {
      // Link Google account if not already linked
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (user.provider !== 'google') {
        user.provider = 'google';
      }
      await user.save();
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider,
        avatar: picture,
        token: generateToken(user.id)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Google authentication failed'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

module.exports = router;
