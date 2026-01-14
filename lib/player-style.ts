// 플레이어 스타일 분석 유틸리티

interface CharacterStats {
  focus: number;
  health: number;
  mental: number;
  growth: number;
}

/**
 * 캐릭터의 스탯을 기반으로 플레이 스타일을 반환
 * 성과 평가 표현 없이 중립적인 성향 중심 표현만 사용
 */
export function getPlayStyle(stats: CharacterStats): string {
  const { focus, health, mental, growth } = stats;
  
  // 모든 스탯의 절댓값 합계 (활동성 지표)
  const totalActivity = Math.abs(focus) + Math.abs(health) + Math.abs(mental) + Math.abs(growth);
  
  // 활동이 거의 없는 경우
  if (totalActivity < 10) {
    return '플레이 시작 단계';
  }
  
  // 각 스탯의 비중 계산
  const maxStat = Math.max(Math.abs(focus), Math.abs(health), Math.abs(mental), Math.abs(growth));
  
  // 균형잡힌 플레이어 (모든 스탯이 비슷한 경우)
  const statDiff = Math.max(focus, health, mental, growth) - Math.min(focus, health, mental, growth);
  if (statDiff < 20 && totalActivity > 20) {
    return '균형 잡힌 플레이어';
  }
  
  // 가장 높은 스탯에 따라 스타일 결정
  if (Math.abs(growth) === maxStat) {
    return '성장 중심 플레이어';
  } else if (Math.abs(mental) === maxStat) {
    return '멘탈 안정형 플레이어';
  } else if (Math.abs(focus) === maxStat) {
    return '집중력 중심 플레이어';
  } else if (Math.abs(health) === maxStat) {
    return '건강 관리형 플레이어';
  }
  
  // 기본값
  return '자유로운 플레이어';
}

/**
 * 누적 XP를 기반으로 랭킹 구간 반환
 * @param myXP 내 누적 XP
 * @param totalPlayers Lv.5 이상 플레이어 총 수
 * @param higherRankedCount 나보다 XP가 높은 플레이어 수
 */
export function getRankTier(myXP: number, totalPlayers: number, higherRankedCount: number): string {
  if (totalPlayers < 2) {
    return '플레이 중';
  }
  
  const percentile = (higherRankedCount / totalPlayers) * 100;
  
  if (percentile <= 10) {
    return '상위 10%';
  } else if (percentile <= 30) {
    return '상위 30%';
  } else {
    return '플레이 중';
  }
}
