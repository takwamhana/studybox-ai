import openai from '../config/openai.js';

const BUDGET_BUFFER_RATIO = 0.98;

const toSafeNumber = (value) => {
  if (typeof value === 'number') return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const buildFallbackPack = ({ field, level, goal, studyStyle, budget }) => {
  const target = Math.max(10, Math.round(budget * 0.85));
  const essentials = [
    {
      name: `${field} quick review notebook`,
      category: 'stationery',
      price: Math.max(12, Math.round(target * 0.2)),
      reason: `Keeps ${level} ${field} notes structured for your ${goal} objective.`,
    },
    {
      name: `${goal} focused planning board`,
      category: 'planning',
      price: Math.max(10, Math.round(target * 0.18)),
      reason: `Translates your ${studyStyle} study style into a practical weekly action plan.`,
    },
    {
      name: `${field} active recall flashcards`,
      category: 'books',
      price: Math.max(8, Math.round(target * 0.2)),
      reason: `Boosts retention speed for ${field} concepts and supports stronger exam/project execution.`,
    },
    {
      name: `${studyStyle} productivity timer`,
      category: 'electronics',
      price: Math.max(9, Math.round(target * 0.17)),
      reason: `Improves session consistency and helps reach your ${goal} milestone faster.`,
    },
  ];

  let runningCost = 0;
  const items = essentials.filter((item) => {
    if (runningCost + item.price > budget) return false;
    runningCost += item.price;
    return true;
  });

  return {
    packName: `${field} ${goal} Smart Box`,
    description: `A practical ${studyStyle} study setup designed for ${level} ${field} students targeting ${goal}.`,
    totalEstimatedCost: runningCost,
    currency: 'DT',
    items,
  };
};

const sanitizeGeneratedPack = (generatedPack, budget) => {
  const items = Array.isArray(generatedPack?.items) ? generatedPack.items : [];
  const sanitizedItems = [];
  let total = 0;
  const maxAllowed = Math.max(10, Math.floor(budget * BUDGET_BUFFER_RATIO));

  for (const item of items) {
    const name = typeof item?.name === 'string' ? item.name.trim() : '';
    const category = typeof item?.category === 'string' ? item.category.trim() : 'other';
    const reason = typeof item?.reason === 'string' ? item.reason.trim() : '';
    const price = Math.round(toSafeNumber(item?.price));

    if (!name || !reason || price <= 0) continue;
    if (total + price > maxAllowed) continue;

    sanitizedItems.push({ name, category, price, reason });
    total += price;
  }

  if (sanitizedItems.length === 0) {
    throw new Error('AI generated empty or invalid items');
  }

  return {
    packName: typeof generatedPack?.packName === 'string' && generatedPack.packName.trim()
      ? generatedPack.packName.trim()
      : 'Personalized StudyBox',
    description: typeof generatedPack?.description === 'string' && generatedPack.description.trim()
      ? generatedPack.description.trim()
      : 'A personalized study pack designed for your profile and budget.',
    currency: 'DT',
    totalEstimatedCost: total,
    items: sanitizedItems,
  };
};

const buildPrompt = ({ field, level, goal, studyStyle, budget }) => `You are an expert educational advisor and ecommerce recommendation engine.

Generate a personalized student study box for:
Field: ${field}
Level: ${level}
Goal: ${goal}
Study Style: ${studyStyle}
Budget: ${budget} DT

Requirements:
- Respect budget strictly. Total must be <= ${budget} DT.
- Use Tunisian Dinar only.
- Recommend realistic products students can buy in Tunisia or online.
- Every item must clearly fit the selected field, level, goal, and style.
- Keep the list practical and outcome-driven (usually 4 to 8 items).
- Lower budget: prioritize essentials only.
- Higher budget: include premium productivity or learning upgrades.
- Return JSON only, no markdown and no extra text.

Return valid JSON exactly with this shape:
{
  "packName": "",
  "description": "",
  "totalEstimatedCost": 0,
  "currency": "DT",
  "items": [
    {
      "name": "",
      "category": "",
      "price": 0,
      "reason": ""
    }
  ]
}`;

export const generateStudyPack = async (input, retryCount = 0) => {
  const { field, level, goal, studyStyle, budget } = input;

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is missing');
  }

  const prompt = buildPrompt({ field, level, goal, studyStyle, budget });

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You generate budget-aware academic recommendation JSON. Always output valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.9,
      max_tokens: 1800,
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Empty AI response');
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error('Malformed JSON returned by AI');
    }

    const normalizedPack = sanitizeGeneratedPack(parsed, budget);

    return {
      ...normalizedPack,
      profile: { field, level, goal, studyStyle, budget },
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown AI error';
    console.error('AI Generation Error:', message);

    if (retryCount < 2 && /(timeout|rate|429|temporarily unavailable)/i.test(message)) {
      await new Promise((resolve) => setTimeout(resolve, 1200 * (retryCount + 1)));
      return generateStudyPack(input, retryCount + 1);
    }

    const fallbackPack = buildFallbackPack({ field, level, goal, studyStyle, budget });
    return {
      ...fallbackPack,
      profile: { field, level, goal, studyStyle, budget },
      generatedAt: new Date().toISOString(),
      fallback: true,
      fallbackReason: message,
    };
  }
};

