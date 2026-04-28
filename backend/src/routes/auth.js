import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateToken, validateEmail, validatePassword } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (userId, email, expiresIn = '7d') => {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn });
};

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters with 1 uppercase letter and 1 number',
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name.trim(),
      statistics: {
        totalBoxes: 0,
        totalOrders: 0,
        totalSpent: 0,
        favoriteFields: [],
      },
      badges: [],
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id.toString(), user.email);

    // Return user data (without password)
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user and select password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.email);

    // Return user data (without password)
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Auth me error:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

router.post('/refresh', (req, res) => {
  try {
    // For simplicity, in production you'd use refresh tokens stored in DB
    // For now, just return a new token if the refresh request is valid
    if (!req.body.email || !req.body.userId) {
      return res.status(400).json({ error: 'Email and userId required' });
    }

    const newToken = generateToken(req.body.userId, req.body.email);
    res.json({ token: newToken });
  } catch (error) {
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

export default router;
