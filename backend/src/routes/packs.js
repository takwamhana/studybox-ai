import express from 'express';
import {
  generateStudyPack,
  getStudyPack,
  getAllStudyPacks,
} from '../controllers/packController.js';

const router = express.Router();

/**
 * POST /api/packs/generate
 * Generate a new AI study pack
 */
router.post('/generate', generateStudyPack);

/**
 * GET /api/packs
 * Get all study packs
 */
router.get('/', getAllStudyPacks);

/**
 * GET /api/packs/:id
 * Get a specific study pack
 */
router.get('/:id', getStudyPack);

export default router;
