// 레벨 시스템 유틸리티

// 레벨별 필요 경험치 계산
// requiredXP(level) = floor(500 * (1.5 ^ (level - 1)))
export function getRequiredXP(level: number): number {
  return Math.floor(500 * Math.pow(1.5, level - 1));
}

// 누적 XP로부터 현재 레벨 계산
export function calculateLevel(totalXP: number): number {
  let level = 1;
  let accumulatedXP = 0;

  while (true) {
    const requiredForNextLevel = getRequiredXP(level);
    if (accumulatedXP + requiredForNextLevel > totalXP) {
      break;
    }
    accumulatedXP += requiredForNextLevel;
    level++;
  }

  return level;
}

// 현재 레벨에서 소모한 XP 계산
export function getXPForCurrentLevel(totalXP: number, currentLevel: number): number {
  let accumulatedXP = 0;
  
  for (let level = 1; level < currentLevel; level++) {
    accumulatedXP += getRequiredXP(level);
  }
  
  return totalXP - accumulatedXP;
}

// 다음 레벨까지 필요한 XP 계산
export function getXPToNextLevel(totalXP: number, currentLevel: number): number {
  const currentLevelXP = getXPForCurrentLevel(totalXP, currentLevel);
  const requiredXP = getRequiredXP(currentLevel);
  return requiredXP - currentLevelXP;
}

// 레벨업 여부 확인 (이전 XP와 현재 XP 비교)
export function checkLevelUp(oldXP: number, newXP: number): {
  leveled: boolean;
  oldLevel: number;
  newLevel: number;
} {
  const oldLevel = calculateLevel(oldXP);
  const newLevel = calculateLevel(newXP);
  
  return {
    leveled: newLevel > oldLevel,
    oldLevel,
    newLevel,
  };
}

// 레벨별 메시지 정의
export const LEVEL_MESSAGES: Record<number, { title: string; message: string; isSpecial: boolean }> = {
  1: {
    title: 'Lv.1 · 플레이 시작',
    message: '당신의 첫 캐릭터가 생성되었습니다.',
    isSpecial: false,
  },
  2: {
    title: '🎉 레벨 업! Lv.2 도달',
    message: "이제 하루를 '의식적으로' 플레이하고 있습니다.",
    isSpecial: true,
  },
  3: {
    title: '🎉 Lv.3 달성',
    message: '당신은 자신의 하루를 객관적으로 보기 시작했습니다.',
    isSpecial: false,
  },
  4: {
    title: '🎉 Lv.4 도달',
    message: '플레이가 습관이 되었습니다.',
    isSpecial: false,
  },
  5: {
    title: '🎉 Lv.5 달성',
    message: '이제 당신은 이 게임의 규칙을 이해했습니다.',
    isSpecial: true,
  },
  6: {
    title: '🎉 Lv.6 도달',
    message: "플레이에 '조절'이 들어가기 시작했습니다.",
    isSpecial: false,
  },
  7: {
    title: '🎉 Lv.7 달성',
    message: '당신만의 플레이 스타일이 보입니다.',
    isSpecial: false,
  },
  8: {
    title: '🎉 Lv.8 도달',
    message: '꾸준함이 가장 강한 스킬이 되었습니다.',
    isSpecial: false,
  },
  9: {
    title: '🎉 Lv.9 달성',
    message: '당신은 이미 충분히 잘 플레이하고 있습니다.',
    isSpecial: false,
  },
  10: {
    title: '👑 Lv.10 도달',
    message: '당신은 이 게임의 베테랑입니다.',
    isSpecial: true,
  },
};

// 레벨 메시지 가져오기
export function getLevelMessage(level: number): { title: string; message: string; isSpecial: boolean } {
  return LEVEL_MESSAGES[level] || {
    title: `🎉 Lv.${level} 달성`,
    message: '플레이를 계속하고 있습니다.',
    isSpecial: false,
  };
}

// 레벨별 필요 XP 미리 계산 (참고용)
export function getXPTable(maxLevel: number = 10): Array<{ level: number; required: number; accumulated: number }> {
  const table = [];
  let accumulated = 0;
  
  for (let level = 1; level <= maxLevel; level++) {
    const required = getRequiredXP(level);
    table.push({
      level,
      required,
      accumulated,
    });
    accumulated += required;
  }
  
  return table;
}
