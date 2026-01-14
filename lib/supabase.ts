import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 환경 변수 확인
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase 환경 변수가 설정되지 않았습니다.');
  console.warn('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅' : '❌');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 타입 정의
export interface Character {
  id: string;
  name: string;
  level: number;
  xp: number;
  focus: number;
  health: number;
  mental: number;
  growth: number;
  created_at: string;
}

export interface DailyLog {
  id: string;
  character_id: string;
  log_date: string;
  raw_text: string;
  focus_delta: number;
  health_delta: number;
  mental_delta: number;
  growth_delta: number;
  xp_gained: number;
  ai_comment: string;
  created_at: string;
}
