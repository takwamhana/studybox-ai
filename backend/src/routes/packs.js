import express from 'express';
import {
  generateStudyPack_Handler,
  getStudyPack,
  getAllStudyPacks,
  getUserStudyPacks,
  saveStudyPack,
  createStudyPack,
} from '../controllers/packController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/generate-pack
 * Generate a new AI study pack (protected)
 */
router.post('/generate', authenticateToken, generateStudyPack_Handler);

/**
 * GET /api/packs/generate
 * Prevent direct browser navigation from being treated as a pack id lookup
 */
router.get('/generate', (req, res) => {
  res.status(405).json({
    success: false,
    error: 'Use POST /api/packs/generate with authentication and a JSON body to generate a study pack',
  });
});

/**
 * GET /api/packs/user
 * Get user's saved study packs (protected)
 */
router.get('/user', authenticateToken, getUserStudyPacks);

/**
 * POST /api/packs/:id/save
 * Manually save a study pack (protected)
 */
router.post('/:id/save', authenticateToken, saveStudyPack);

/**
 * GET /api/packs
 * Get all study packs (public)
 */
router.get('/', getAllStudyPacks);

/**
 * POST /api/packs
 * Create a study pack from client-provided data (protected)
 */
router.post('/', authenticateToken, createStudyPack);

/**
 * GET /api/packs/:id
 * Get a specific study pack
 */
router.get('/:id', getStudyPack);

export default router;
