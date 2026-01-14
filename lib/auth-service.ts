// 인증 서비스
// MVP용 간단한 아이디/비밀번호 인증

import { supabase } from './supabase';

export interface User {
  id: string;
  user_id: string;
  created_at: string;
}

// 비밀번호 해싱 (브라우저용 간단한 해싱)
// 주의: 이것은 MVP용이며, 프로덕션에서는 백엔드에서 bcrypt 등을 사용해야 합니다
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// 로그인 정보를 로컬스토리지에 저장
export function saveAuth(userId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userId', userId);
    localStorage.setItem('isLoggedIn', 'true');
  }
}

// 로그인 정보 가져오기
export function getAuth(): { userId: string | null; isLoggedIn: boolean } {
  if (typeof window !== 'undefined') {
    return {
      userId: localStorage.getItem('userId'),
      isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    };
  }
  return { userId: null, isLoggedIn: false };
}

// 로그아웃
export function clearAuth(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userId');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('characterId'); // 캐릭터 ID도 제거
  }
}

// 로그인 여부 확인
export function isLoggedIn(): boolean {
  return getAuth().isLoggedIn;
}

// 회원가입
export async function signUp(
  userId: string,
  password: string,
  nickname: string
): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    // 입력 검증
    if (!userId || !password || !nickname) {
      return { success: false, error: '모든 항목을 입력해주세요.' };
    }

    if (userId.length < 4) {
      return { success: false, error: '아이디는 4자 이상이어야 합니다.' };
    }

    if (password.length < 6) {
      return { success: false, error: '비밀번호는 6자 이상이어야 합니다.' };
    }

    // 기존 사용자 확인
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingUser) {
      return { success: false, error: '이미 사용중인 아이디입니다.' };
    }

    // 비밀번호 해싱
    const passwordHash = await hashPassword(password);

    // 사용자 생성
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert([{ user_id: userId, password_hash: passwordHash }])
      .select()
      .single();

    if (userError) throw userError;
    if (!newUser) throw new Error('사용자 생성 실패');

    // 캐릭터 생성 (Lv.1부터 시작)
    const { data: newCharacter, error: characterError } = await supabase
      .from('characters')
      .insert([{
        user_id: newUser.id,
        nickname,
        level: 1,
        xp: 0,
        focus: 0,
        health: 0,
        mental: 0,
        growth: 0,
      }])
      .select()
      .single();

    if (characterError) throw characterError;
    if (!newCharacter) throw new Error('캐릭터 생성 실패');

    // 로그인 정보 저장
    saveAuth(newUser.id);
    
    // 캐릭터 ID도 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('characterId', newCharacter.id);
    }

    return { success: true, userId: newUser.id };
  } catch (error) {
    console.error('회원가입 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.',
    };
  }
}

// 로그인
export async function signIn(
  userId: string,
  password: string
): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    // 입력 검증
    if (!userId || !password) {
      return { success: false, error: '아이디와 비밀번호를 입력해주세요.' };
    }

    // 비밀번호 해싱
    const passwordHash = await hashPassword(password);

    // 사용자 조회
    const { data: user, error } = await supabase
      .from('users')
      .select('id, user_id, password_hash')
      .eq('user_id', userId)
      .eq('password_hash', passwordHash)
      .single();

    if (error || !user) {
      return { success: false, error: '아이디 또는 비밀번호가 일치하지 않습니다.' };
    }

    // 캐릭터 조회
    const { data: character } = await supabase
      .from('characters')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!character) {
      return { success: false, error: '캐릭터를 찾을 수 없습니다.' };
    }

    // 로그인 정보 저장
    saveAuth(user.id);
    
    // 캐릭터 ID도 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('characterId', character.id);
    }

    return { success: true, userId: user.id };
  } catch (error) {
    console.error('로그인 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.',
    };
  }
}

// 사용자 정보 가져오기
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { userId } = getAuth();
    if (!userId) return null;

    const { data, error } = await supabase
      .from('users')
      .select('id, user_id, created_at')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    return null;
  }
}
