import { supabase, Character, DailyLog } from './supabase';
import { calculateLevel, checkLevelUp } from './level-system';

// 캐릭터 ID를 로컬 스토리지에 저장
export function saveCharacterId(id: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('characterId', id);
  }
}

// 로컬 스토리지에서 캐릭터 ID 가져오기
export function getCharacterId(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('characterId');
  }
  return null;
}

// 캐릭터 생성
export async function createCharacter(name: string): Promise<Character | null> {
  try {
    // Supabase 연결 확인
    if (!supabase) {
      throw new Error('Supabase 클라이언트가 초기화되지 않았습니다. 환경 변수를 확인하세요.');
    }

    const newCharacter = {
      name,
      level: 1,
      xp: 0,
      focus: 0,
      health: 0,
      mental: 0,
      growth: 0,
    };

    const { data, error } = await supabase
      .from('characters')
      .insert([newCharacter])
      .select()
      .single();

    if (error) {
      console.error('Supabase 에러:', error);
      throw new Error(`데이터베이스 오류: ${error.message}\n\n테이블이 생성되었는지 확인하세요.`);
    }

    // 생성된 캐릭터 ID 저장
    if (data) {
      saveCharacterId(data.id);
    }

    return data;
  } catch (error) {
    console.error('캐릭터 생성 오류:', error);
    throw error; // 에러를 다시 throw하여 상위에서 처리
  }
}

// 캐릭터 조회
export async function getCharacter(id: string): Promise<Character | null> {
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('캐릭터 조회 오류:', error);
    return null;
  }
}

// 캐릭터 스탯 업데이트 (레벨업 정보 포함)
export async function updateCharacterStats(
  id: string,
  statDeltas: {
    focus: number;
    health: number;
    mental: number;
    growth: number;
  },
  xpGained: number
): Promise<{ character: Character; levelUp: { leveled: boolean; oldLevel: number; newLevel: number } } | null> {
  try {
    // 현재 캐릭터 정보 가져오기
    const character = await getCharacter(id);
    if (!character) return null;

    // 새로운 스탯 계산
    const newFocus = character.focus + statDeltas.focus;
    const newHealth = character.health + statDeltas.health;
    const newMental = character.mental + statDeltas.mental;
    const newGrowth = character.growth + statDeltas.growth;
    const newXp = character.xp + xpGained;
    const newLevel = calculateLevel(newXp);

    // 레벨업 여부 확인
    const levelUpInfo = checkLevelUp(character.xp, newXp);

    // 캐릭터 업데이트
    const { data, error } = await supabase
      .from('characters')
      .update({
        focus: newFocus,
        health: newHealth,
        mental: newMental,
        growth: newGrowth,
        xp: newXp,
        level: newLevel,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      character: data,
      levelUp: levelUpInfo,
    };
  } catch (error) {
    console.error('캐릭터 업데이트 오류:', error);
    return null;
  }
}

// 오늘의 플레이 로그 저장
export async function saveDailyLog(
  characterId: string,
  rawText: string,
  stats: {
    focus: number;
    health: number;
    mental: number;
    growth: number;
  },
  xpGained: number,
  aiComment: string
): Promise<DailyLog | null> {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const newLog = {
      character_id: characterId,
      log_date: today,
      raw_text: rawText,
      focus_delta: stats.focus,
      health_delta: stats.health,
      mental_delta: stats.mental,
      growth_delta: stats.growth,
      xp_gained: xpGained,
      ai_comment: aiComment,
    };

    const { data, error } = await supabase
      .from('daily_logs')
      .insert([newLog])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('로그 저장 오류:', error);
    return null;
  }
}
