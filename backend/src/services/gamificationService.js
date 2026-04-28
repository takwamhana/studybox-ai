// Gamification Constants
export const XP_REWARDS = {
  PACK_GENERATED: 10,
  PACK_SAVED: 5,
};

export const LEVELS = {
  BEGINNER: { name: 'Beginner', minXp: 0, maxXp: 50 },
  INTERMEDIATE: { name: 'Intermediate', minXp: 51, maxXp: 150 },
  ADVANCED: { name: 'Advanced', minXp: 151, maxXp: Infinity },
};

export const BADGES = {
  FIRST_PACK: { id: 'first-pack', name: '🚀 First Pack Created' },
  BUDGET_MASTER: { id: 'budget-master', name: '💰 Budget Master' },
  EXAM_SURVIVOR: { id: 'exam-survivor', name: '📚 Exam Survivor' },
  AI_PLANNER: { id: 'ai-planner', name: '🤖 AI Planner' },
};

export const calculateLevel = (xp) => {
  if (xp <= 50) return LEVELS.BEGINNER.name;
  if (xp <= 150) return LEVELS.INTERMEDIATE.name;
  return LEVELS.ADVANCED.name;
};

export const awardXp = async (user, xpAmount) => {
  const previousXp = user.statistics.xp;
  user.statistics.xp += xpAmount;

  const previousLevel = calculateLevel(previousXp);
  const newLevel = calculateLevel(user.statistics.xp);

  // Level up notification if level changed
  const leveledUp = previousLevel !== newLevel;

  return { leveledUp, newLevel, totalXp: user.statistics.xp };
};

export const unlockBadge = (user, badgeId) => {
  const badgeExists = user.badges.some((b) => b.id === badgeId);
  if (!badgeExists) {
    const badge = Object.values(BADGES).find((b) => b.id === badgeId);
    if (badge) {
      user.badges.push({
        id: badge.id,
        name: badge.name,
        unlockedAt: new Date(),
        progress: 100,
      });
      return true;
    }
  }
  return false;
};

export const checkAndUnlockBadges = (user, context) => {
  const newBadges = [];

  // First pack created
  if (context.isFirstPack && user.statistics.totalBoxes === 1) {
    if (unlockBadge(user, BADGES.FIRST_PACK.id)) {
      newBadges.push(BADGES.FIRST_PACK);
    }
  }

  // Budget Master (generated pack under 50% of budget)
  if (context.packCost && context.budget && context.packCost < context.budget * 0.5) {
    if (unlockBadge(user, BADGES.BUDGET_MASTER.id)) {
      newBadges.push(BADGES.BUDGET_MASTER);
    }
  }

  // Exam Survivor (created exam pack)
  if (context.goal === 'Exams' && user.statistics.totalBoxes % 5 === 0) {
    if (unlockBadge(user, BADGES.EXAM_SURVIVOR.id)) {
      newBadges.push(BADGES.EXAM_SURVIVOR);
    }
  }

  // AI Planner (10 packs created)
  if (user.statistics.totalBoxes >= 10) {
    if (unlockBadge(user, BADGES.AI_PLANNER.id)) {
      newBadges.push(BADGES.AI_PLANNER);
    }
  }

  return newBadges;
};
