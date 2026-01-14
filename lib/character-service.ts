import { supabase, Character, DailyLog } from './supabase';

// 레벨 계산 공식: level = floor(total_xp / 500) + 1
export function calculateLevel(xp: number): number {
  return Math.floor(xp / 500) + 1;
}

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

    if (error) throw error;

    // 생성된 캐릭터 ID 저장
    if (data) {
      saveCharacterId(data.id);
    }

    return data;
  } catch (error) {
    console.error('캐릭터 생성 오류:', error);
    return null;
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

// 캐릭터 스탯 업데이트
export async function updateCharacterStats(
  id: string,
  statDeltas: {
    focus: number;
    health: number;
    mental: number;
    growth: number;
  },
  xpGained: number
): Promise<Character | null> {
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

    return data;
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
