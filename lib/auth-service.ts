// Supabase Auth 기반 인증 서비스
// 보안이 검증된 Supabase의 내장 인증 시스템 사용

import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    nickname?: string;
  };
}

// 회원가입
export async function signUp(
  email: string,
  password: string,
  nickname: string
): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    // 입력 검증
    if (!email || !password || !nickname) {
      return { success: false, error: '모든 항목을 입력해주세요.' };
    }

    if (email.length < 4) {
      return { success: false, error: '아이디는 4자 이상이어야 합니다.' };
    }

    if (password.length < 6) {
      return { success: false, error: '비밀번호는 6자 이상이어야 합니다.' };
    }

    // Supabase Auth로 회원가입
    const { data, error } = await supabase.auth.signUp({
      email: `${email}@life-as-a-game.local`, // 이메일 형식으로 변환
      password,
      options: {
        data: {
          nickname, // 사용자 메타데이터에 닉네임 저장
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return { success: false, error: '이미 사용중인 아이디입니다.' };
      }
      throw error;
    }

    if (!data.user) {
      throw new Error('사용자 생성 실패');
    }

    // 캐릭터 생성 (Lv.1부터 시작)
    const { data: newCharacter, error: characterError } = await supabase
      .from('characters')
      .insert([{
        user_id: data.user.id, // auth.users.id 참조
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

    // 캐릭터 ID를 localStorage에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('characterId', newCharacter.id);
    }

    return { success: true, userId: data.user.id };
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
  email: string,
  password: string
): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    // 입력 검증
    if (!email || !password) {
      return { success: false, error: '아이디와 비밀번호를 입력해주세요.' };
    }

    // Supabase Auth로 로그인
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${email}@life-as-a-game.local`,
      password,
    });

    if (error) {
      return { success: false, error: '아이디 또는 비밀번호가 일치하지 않습니다.' };
    }

    if (!data.user) {
      return { success: false, error: '로그인에 실패했습니다.' };
    }

    // 캐릭터 조회
    const { data: character, error: characterError } = await supabase
      .from('characters')
      .select('id')
      .eq('user_id', data.user.id)
      .single();

    if (characterError || !character) {
      return { success: false, error: '캐릭터를 찾을 수 없습니다.' };
    }

    // 캐릭터 ID를 localStorage에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('characterId', character.id);
    }

    return { success: true, userId: data.user.id };
  } catch (error) {
    console.error('로그인 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.',
    };
  }
}

// 로그아웃
export async function signOut(): Promise<void> {
  try {
    await supabase.auth.signOut();
    
    // localStorage 정리
    if (typeof window !== 'undefined') {
      localStorage.removeItem('characterId');
      localStorage.removeItem('tutorialCompleted');
    }
  } catch (error) {
    console.error('로그아웃 오류:', error);
  }
}

// 현재 로그인된 사용자 확인
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata,
    };
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    return null;
  }
}

// 로그인 여부 확인 (간단한 세션 체크)
export async function isLoggedIn(): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    return false;
  }
}

// 로그인 여부 확인 (동기)
export function isLoggedInSync(): boolean {
  if (typeof window === 'undefined') return false;
  
  // localStorage에 characterId가 있으면 로그인된 것으로 간주
  // 실제 검증은 각 페이지에서 getCurrentUser()로 수행
  return !!localStorage.getItem('characterId');
}

// 캐릭터 ID 가져오기
export function getCharacterId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('characterId');
}

// auth 상태 변화 감지 (리스너)
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email,
        user_metadata: session.user.user_metadata,
      });
    } else {
      callback(null);
    }
  });
}
