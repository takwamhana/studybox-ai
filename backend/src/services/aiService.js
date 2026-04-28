import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Context-aware descriptions for different parameters
const getFieldContext = (field) => {
  const contexts = {
    'computer-science': 'focuses on coding, algorithms, data structures, and programming fundamentals',
    'medicine': 'focuses on anatomy, physiology, pathology, and clinical practice',
    'law': 'focuses on case law, statutes, legal research, and argumentation',
    'engineering': 'focuses on circuits, thermodynamics, mechanics, and technical drawings',
    'business': 'focuses on strategy, finance, marketing, and case analysis',
    'psychology': 'focuses on theories, research methods, and behavioral concepts',
    'default': 'focuses on general academic study'
  };
  return contexts[field] || contexts['default'];
};

const getGoalContext = (goal) => {
  const contexts = {
    'exams': 'prepare for high-stakes final exams through intensive revision and active recall',
    'projects': 'complete long-form group projects with structured research and collaboration',
    'revision': 'maintain steady weekly study habits and deepen understanding gradually',
    'internship': 'develop practical, career-ready skills and professional preparation',
    'default': 'general study preparation'
  };
  return contexts[goal] || contexts['default'];
};

const getStyleRecommendations = (style) => {
  const recs = {
    'organized': 'structured planners, color-coded systems, digital organization tools, time management aids',
    'last-minute': 'quick reference guides, efficiency tools, high-focus work timers, energy supplements',
    'visual': 'mind mapping materials, color-based learning tools, diagrams, visual reference guides',
    'minimalistic': 'essential tools only, digital solutions over physical, distraction-removed setup, quiet focus aids',
    'default': 'balanced study tools'
  };
  return recs[style] || recs['default'];
};

const getLevelRecommendations = (level) => {
  const recs = {
    'high-school': 'foundational textbooks, basic stationery, study guides, practice problem sets',
    'undergraduate': 'intermediate textbooks, advanced note-taking tools, research databases, academic software',
    'graduate': 'specialized research materials, academic software subscriptions, advanced references, professional development tools',
    'phd': 'cutting-edge research tools, specialized databases, publishing aids, professional conference resources',
    'professional': 'continuing education materials, professional certifications, industry-specific tools',
    'default': 'standard academic materials'
  };
  return recs[level] || recs['default'];
};

export const generateStudyPack = async (input) => {
  const { field, level, goal, studyStyle, budget } = input;

  const fieldContext = getFieldContext(field);
  const goalContext = getGoalContext(goal);
  const styleRecommendations = getStyleRecommendations(studyStyle);
  const levelRecommendations = getLevelRecommendations(level);

  const prompt = `You are an expert educational consultant specializing in creating highly personalized study kits in Tunisian Dinar (DT).

STUDENT PROFILE:
- Field of Study: ${field} (${fieldContext})
- Academic Level: ${level} (${levelRecommendations})
- Primary Goal: ${goal} (${goalContext})
- Study Style: ${studyStyle} - HIGHLY RECOMMEND: ${styleRecommendations}
- Budget: ${budget} DT (MUST NOT EXCEED)

YOUR TASK:
Create a hyper-personalized study kit that DIRECTLY addresses this specific student's needs. The kit should:

1. FIELD-SPECIFIC: Choose items that are essential for ${field} studies
2. LEVEL-APPROPRIATE: Match complexity level for ${level} students
3. GOAL-ALIGNED: Optimize for ${goal} objectives (not generic tools)
4. STYLE-TAILORED: Items that match the ${studyStyle} work style
5. BUDGET-STRICT: Total MUST NOT exceed ${budget} DT

CRITICAL RULES:
- Each item MUST justify WHY it helps THIS SPECIFIC profile achieve THEIR goal
- Avoid generic items - be specific to field + goal + style combination
- Total cost MUST NOT exceed ${budget} DT (non-negotiable)
- All prices in Tunisian Dinar (DT) only
- Suggest 4-10 items depending on budget and field complexity
- Focus on IMPACT over quantity

CONTEXTUAL GUIDANCE:
- For ${studyStyle} learners: emphasize ${styleRecommendations}
- For ${goal} goal: focus on tools that enable ${goalContext}
- For ${level} level: include ${levelRecommendations}

Return ONLY this exact JSON structure, nothing else:
{
  "packName": "Creative name specific to [field], [goal], and [level]",
  "description": "1 sentence describing why THIS pack solves THIS student's specific challenge",
  "totalEstimatedCost": number,
  "currency": "DT",
  "items": [
    {
      "name": "Item name",
      "category": "stationery|electronics|books|study snacks|planners & organization tools|digital tools",
      "price": number,
      "reason": "SPECIFIC reason why this helps [field] student achieve [goal] with [style]"
    }
  ]
}

Example reasoning format:
❌ AVOID: "Good for studying"
✓ USE: "Enables active recall practice for medical students preparing for board exams using visual flashcards"

Remember: Every item should feel like it was picked SPECIFICALLY for this student, not generically.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8, // Slightly higher for more personalized, creative suggestions
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from AI');
    }

    const generatedPack = JSON.parse(jsonMatch[0]);

    // Validate budget constraint
    if (generatedPack.totalEstimatedCost > budget) {
      throw new Error(`Generated pack exceeds budget: ${generatedPack.totalEstimatedCost} > ${budget}`);
    }

    // Enhance response with metadata
    return {
      ...generatedPack,
      profile: { field, level, goal, studyStyle, budget },
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw new Error('Failed to generate study pack: ' + error.message);
  };
};

