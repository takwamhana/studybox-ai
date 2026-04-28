import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import StudyPack from '../models/StudyPack.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userId !== req.params.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userId !== req.params.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { name, avatar, preferences } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name.trim();
    if (avatar) user.avatar = avatar;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.patch('/:id/password', authenticateToken, async (req, res) => {
  try {
    if (req.user.userId !== req.params.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old and new password required' });
    }

    const user = await User.findById(req.params.id).select('+password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid old password' });
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Return user without password
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Get user badges
router.get('/:id/badges', authenticateToken, async (req, res) => {
  try {
    if (req.user.userId !== req.params.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      badges: user.badges || [],
      statistics: user.statistics,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch badges' });
  }
});

// Get user statistics and gamification data
router.get('/:id/statistics', authenticateToken, async (req, res) => {
  try {
    if (req.user.userId !== req.params.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      statistics: user.statistics || {},
      gamification: {
        level: user.level,
        badges: user.badges || [],
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
