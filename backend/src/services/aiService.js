import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Context-aware descriptions for different parameters
const getFieldContext = (field) => {
  const contexts = {
    'computer-science': 'focuses on coding, algorithms, data structures, software design, debugging, and problem-solving',
    'medicine': 'focuses on anatomy, physiology, pathology, drug interactions, clinical diagnoses, and patient care',
    'law': 'focuses on case law precedents, statutes, legal research, argumentation, and courtroom advocacy',
    'engineering': 'focuses on circuits, thermodynamics, mechanics, technical drawings, CAD, and system design',
    'business': 'focuses on strategy, financial analysis, marketing campaigns, case studies, and Excel modeling',
    'psychology': 'focuses on theories, research methods, behavioral concepts, statistics, and case studies',
    'mathematics': 'focuses on proofs, problem solving, abstract concepts, formulas, and practice exercises',
    'physics': 'focuses on formulas, lab experiments, problem-solving, visualization, and real-world applications',
    'chemistry': 'focuses on reactions, molecular structures, lab work, periodic table, and chemical equations',
    'history': 'focuses on timelines, primary sources, critical analysis, and historical context',
    'default': 'focuses on general academic study'
  };
  return contexts[field] || contexts['default'];
};

const getGoalContext = (goal) => {
  const contexts = {
    'exams': 'prepare for high-stakes final exams via intensive revision, active recall, and repeated practice tests',
    'projects': 'complete long-form group projects through structured research, collaboration tools, and organization',
    'revision': 'maintain steady weekly study habits and progressively deepen conceptual understanding',
    'internship': 'develop practical, career-ready skills with industry-standard tools and professional preparation',
    'mastery': 'achieve deep expertise and comprehensive subject knowledge through advanced materials',
    'certification': 'pass professional certifications with focused study on exam domains and practice tests',
    'default': 'general study preparation'
  };
  return contexts[goal] || contexts['default'];
};

const getStyleRecommendations = (style) => {
  const recs = {
    'organized': 'structured planners, color-coded systems, digital tools (Notion/OneNote), task managers, time-blocking supplies',
    'last-minute': 'quick reference guides, high-efficiency tools, pomodoro timers, energy management aids, cheat sheets',
    'visual': 'mind mapping software, color highlighters, diagrams, infographics, video learning platforms, visual flashcards',
    'minimalistic': 'essential tools only, digital-first approach, single notebook system, distraction blockers, minimal supplies',
    'collaborative': 'communication tools, shared docs, group planning materials, presentation supplies',
    'hands-on': 'practice materials, lab supplies, interactive tools, building kits, tangible learning aids',
    'default': 'balanced study tools'
  };
  return recs[style] || recs['default'];
};

const getLevelRecommendations = (level) => {
  const recs = {
    'high-school': 'foundational textbooks, basic stationery, official study guides, practice problem sets, tutoring access',
    'undergraduate': 'comprehensive textbooks, advanced note-taking tools, research databases (academic access), professional software',
    'graduate': 'specialized research materials, academic subscriptions (JSTOR, IEEE), advanced software, professional networks',
    'phd': 'cutting-edge research databases, specialized journals, publishing tools, conference materials, research collaboration platforms',
    'professional': 'certification prep materials, industry software, continuing education courses, professional development tools',
    'default': 'standard academic materials'
  };
  return recs[level] || recs['default'];
};

export const generateStudyPack = async (input, retryCount = 0) => {
  const { field, level, goal, studyStyle, budget } = input;

  const fieldContext = getFieldContext(field);
  const goalContext = getGoalContext(goal);
  const styleRecommendations = getStyleRecommendations(studyStyle);
  const levelRecommendations = getLevelRecommendations(level);

  const prompt = `You are an expert educational consultant specializing in creating hyper-personalized study kits optimized for success.

STUDENT PROFILE:
- Field: ${field} (${fieldContext})
- Level: ${level} (${levelRecommendations})
- Goal: ${goal} (${goalContext})
- Style: ${studyStyle} (Recommend: ${styleRecommendations})
- Budget: ${budget} DT (ABSOLUTE MAXIMUM - do not exceed)

GENERATION RULES:
1. Select 5-10 items TAILORED to THIS exact combination of field+goal+level+style
2. Each item MUST have a specific reason WHY it helps achieve the goal
3. Prioritize: ${goal === 'exams' ? 'active recall tools, practice materials, time management' : goal === 'projects' ? 'collaboration tools, research resources, organization' : goal === 'internship' ? 'professional skills, portfolio building, industry tools' : 'comprehensive understanding, progressive learning'}
4. Think like a coach: suggest items that give competitive advantage
5. Validate total price ≤ ${budget} DT before responding

EXAMPLE ITEMS FOR ${field.toUpperCase()}:
${field === 'computer-science' ? '- VS Code Premium, Leetcode Subscription, Algorithm visualization tools, Debugger hardware' : 
field === 'medicine' ? '- Anatomy flash cards, Pathology atlases, Medical simulation software, Case study collections' :
field === 'law' ? '- Legal research database (LexisNexis), Case precedent collections, Legal writing guides, Moot court materials' :
field === 'business' ? '- Financial modeling software, Market analysis tools, Case study databases, Business simulation softwares' :
field === 'psychology' ? '- Research methodology guides, Statistics software, Psychology databases, Study material compilations' :
field === 'mathematics' ? '- Graphing calculators, Proof writing guides, Problem solution manuals, Online tutoring subscriptions' :
field === 'physics' ? '- Lab simulation software, Physics problem solvers, Visualization tools, Formula reference cards' :
field === 'engineering' ? '- CAD software, Circuit simulators, Engineering calculators, Technical reference manuals' :
field === 'chemistry' ? '- Molecular modeling software, Periodic table infographics, Lab safety guides, Reaction databases' :
field === 'history' ? '- Primary source collections, Timeline tools, Historical databases, Documentary subscriptions' :
'- Study guides, note-taking tools, organization supplies'}

RESPONSE FORMAT (JSON ONLY):
{
  "packName": "Specific, creative name reflecting the ${goal} goal for ${field} students",
  "description": "1 sentence: Why this pack solves THIS student's exact challenge",
  "totalEstimatedCost": [number, must be ≤ ${budget}],
  "currency": "DT",
  "items": [
    {
      "name": "[Specific product name]",
      "category": "[stationery|electronics|books|courses|software|physical tools|services]",
      "price": [number in DT],
      "reason": "[${field}] + [${goal}] + [${level}] context: Specific, concrete benefit"
    }
  ]
}

CRITICAL: Return ONLY valid JSON. No markdown, no explanation.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7, // Balanced for consistency + creativity
      max_tokens: 2500,
    });

    const content = response.choices[0].message.content;

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from AI');
    }

    const generatedPack = JSON.parse(jsonMatch[0]);

    // Validate output
    if (!generatedPack.items || generatedPack.items.length === 0) {
      throw new Error('AI generated pack with no items');
    }

    // Final budget validation
    if (generatedPack.totalEstimatedCost > budget) {
      throw new Error(`Generated pack exceeds budget: ${generatedPack.totalEstimatedCost} DT > ${budget} DT`);
    }

    // Ensure all prices are valid
    if (generatedPack.items.some(item => typeof item.price !== 'number' || item.price < 0)) {
      throw new Error('Invalid item prices in generated pack');
    }

    // Enhance response with metadata
    return {
      ...generatedPack,
      profile: { field, level, goal, studyStyle, budget },
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('AI Generation Error:', error);
    
    // Retry logic for transient errors
    if (retryCount < 2 && (error.message.includes('timeout') || error.message.includes('rate_limit'))) {
      console.log(`Retrying AI generation (attempt ${retryCount + 1})...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
      return generateStudyPack(input, retryCount + 1);
    }

    throw new Error('Failed to generate study pack: ' + error.message);
  }
};

