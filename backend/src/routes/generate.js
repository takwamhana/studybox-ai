import express from 'express';
import { generateStudyPack_Handler } from '../controllers/packController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/generate-pack
 * Generate an AI-powered study pack
 */
router.post('/', authenticateToken, generateStudyPack_Handler);

export default router;
