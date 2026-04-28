import { generateStudyPack } from '../services/aiService.js';
import { awardXp, checkAndUnlockBadges, calculateLevel } from '../services/gamificationService.js';
import StudyPack from '../models/StudyPack.js';
import User from '../models/User.js';

/**
 * Generate an AI-powered study pack based on user inputs
 * POST /api/generate-pack
 */
export const generateStudyPack_Handler = async (req, res) => {
  try {
    const { field, level, goal, studyStyle, budget } = req.body;

    // Validate input
    if (!field || !level || !goal || !studyStyle || budget === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: field, level, goal, studyStyle, budget',
      });
    }

    if (typeof budget !== 'number' || budget < 0) {
      return res.status(400).json({
        success: false,
        error: 'Budget must be a non-negative number (in DT)',
      });
    }

    // Generate pack using AI service
    const generatedPack = await generateStudyPack({
      field,
      level,
      goal,
      studyStyle,
      budget,
    });

    // Get user for gamification
    const user = await User.findById(req.user.userId);
    const isFirstPack = user.statistics.totalBoxes === 0;

    // Save to database
    const studyPack = new StudyPack({
      userId: req.user.userId,
      input: {
        field,
        level,
        goal,
        studyStyle,
        budget,
      },
      generatedPack,
    });

    await studyPack.save();

    // Apply gamification
    user.statistics.totalBoxes += 1;

    // Award XP for generating pack
    const xpResult = await awardXp(user, 10); // +10 XP
    user.statistics.xp = xpResult.totalXp;
    user.level = calculateLevel(user.statistics.xp);

    // Check and unlock badges
    const newBadges = checkAndUnlockBadges(user, {
      isFirstPack,
      packCost: generatedPack.totalEstimatedCost,
      budget,
      goal,
    });

    await user.save();

    res.status(201).json({
      success: true,
      generatedPack: {
        ...generatedPack,
        id: studyPack._id,
      },
      gamification: {
        xpEarned: 10,
        totalXp: user.statistics.xp,
        level: user.level,
        leveledUp: xpResult.leveledUp,
        newBadges: newBadges.length > 0 ? newBadges : null,
      },
    });
  } catch (error) {
    console.error('Error generating study pack:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate study pack',
    });
  }
};

/**
 * Get a previously generated study pack by ID
 * GET /api/packs/:id
 */
export const getStudyPack = async (req, res) => {
  try {
    const { id } = req.params;

    const studyPack = await StudyPack.findById(id);

    if (!studyPack) {
      return res.status(404).json({
        success: false,
        error: 'Study pack not found',
      });
    }

    res.status(200).json({
      success: true,
      data: studyPack,
    });
  } catch (error) {
    console.error('Error fetching study pack:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch study pack',
    });
  }
};

/**
 * Get all study packs (optional, for admin/analytics)
 * GET /api/packs
 */
export const getAllStudyPacks = async (req, res) => {
  try {
    const packs = await StudyPack.find().sort({ createdAt: -1 }).limit(50);

    res.status(200).json({
      success: true,
      count: packs.length,
      data: packs,
    });
  } catch (error) {
    console.error('Error fetching study packs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch study packs',
    });
  }
};

/**
 * Get user's saved study packs
 * GET /api/packs/user
 */
export const getUserStudyPacks = async (req, res) => {
  try {
    const packs = await StudyPack.find({ userId: req.user.userId })
      .sort({ savedDate: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      count: packs.length,
      data: packs,
    });
  } catch (error) {
    console.error('Error fetching user study packs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user study packs',
    });
  }
};

/**
 * Manually save a study pack
 * POST /api/packs/:id/save
 */
export const saveStudyPack = async (req, res) => {
  try {
    const { id } = req.params;

    const pack = await StudyPack.findById(id);

    if (!pack) {
      return res.status(404).json({
        success: false,
        error: 'Study pack not found',
      });
    }

    // Update savedDate
    pack.savedDate = new Date();
    await pack.save();

    // Award XP for saving
    const user = await User.findById(req.user.userId);
    const xpResult = await awardXp(user, 5); // +5 XP
    user.statistics.xp = xpResult.totalXp;
    user.level = calculateLevel(user.statistics.xp);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Study pack saved',
      data: pack,
      gamification: {
        xpEarned: 5,
        totalXp: user.statistics.xp,
        level: user.level,
      },
    });
  } catch (error) {
    console.error('Error saving study pack:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save study pack',
    });
  }
};
