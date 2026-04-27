import openai from '../config/openai.js';
import StudyPack from '../models/StudyPack.js';

/**
 * Generate an AI-powered study pack based on user inputs
 * POST /api/packs/generate
 */
export const generateStudyPack = async (req, res) => {
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
        error: 'Budget must be a non-negative number',
      });
    }

    // Create a detailed, structured prompt for OpenAI
    const prompt = `You are an expert educational consultant specializing in creating optimized study kits for students. Your role is to generate realistic, practical study packs that respect strict budget constraints.

STUDENT PROFILE:
- Academic Field: ${field}
- Education Level: ${level}
- Study Goal: ${goal}
- Study Style: ${studyStyle}
- Budget: $${budget}

YOUR TASK:
Generate a structured study pack that:
1. STRICTLY respects the budget constraint (total cost ≤ $${budget})
2. Recommends realistic, student-friendly items (books, supplies, software, courses, etc.)
3. Optimizes for the student's success based on their profile
4. Includes a clear explanation for why each item is recommended

RESPONSE FORMAT (MUST be valid JSON only, no markdown, no explanations):
{
  "packName": "A creative, memorable name for this study pack",
  "description": "2-3 sentences describing the pack's focus and benefits",
  "totalEstimatedCost": <exact total cost as a number>,
  "items": [
    {
      "name": "Specific product name",
      "category": "books|stationery|tech|supplies|software|courses|other",
      "price": <estimated price as a number>,
      "reason": "Why this item is essential for this student's goals"
    }
  ]
}

IMPORTANT CONSTRAINTS:
- Return ONLY valid JSON, nothing else
- totalEstimatedCost must equal sum of all item prices
- Each item price must be realistic and reasonable
- Suggest 4-8 items depending on budget
- All prices must sum to ≤ $${budget}
- Be specific with product names (not generic "book", but "Python Crash Course" or "Linear Algebra for Dummies")
- Tailor recommendations to ${studyStyle} study style`;

    // Call OpenAI API
    const message = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const generatedText = message.choices[0].message.content.trim();

    // Parse JSON response safely
    let generatedPack;
    try {
      generatedPack = JSON.parse(generatedText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', generatedText);
      return res.status(500).json({
        success: false,
        error: 'Failed to parse AI response. Please try again.',
      });
    }

    // Validate the parsed response structure
    if (
      !generatedPack.packName ||
      !generatedPack.description ||
      generatedPack.totalEstimatedCost === undefined ||
      !Array.isArray(generatedPack.items)
    ) {
      return res.status(500).json({
        success: false,
        error: 'Invalid response structure from AI',
      });
    }

    // Verify budget constraint
    if (generatedPack.totalEstimatedCost > budget) {
      return res.status(500).json({
        success: false,
        error: `AI exceeded budget: $${generatedPack.totalEstimatedCost} > $${budget}. Please try again.`,
      });
    }

    // Save to database
    const studyPack = new StudyPack({
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

    res.status(201).json({
      success: true,
      data: {
        id: studyPack._id,
        ...generatedPack,
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
