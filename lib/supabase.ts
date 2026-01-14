import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// #region agent log
fetch('http://127.0.0.1:7242/ingest/1c8f892f-924f-4efd-9cbd-58f06c6471cc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase.ts:3',message:'Client env vars loaded',data:{urlExists:!!supabaseUrl,urlLength:supabaseUrl.length,anonKeyExists:!!supabaseAnonKey,anonKeyLength:supabaseAnonKey.length,urlValue:supabaseUrl.substring(0,30),anonKeyPrefix:supabaseAnonKey.substring(0,10)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A,C'})}).catch(()=>{});
// #endregion

// 환경 변수 확인
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase 환경 변수가 설정되지 않았습니다.');
  console.warn('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅' : '❌');
}

// #region agent log
fetch('http://127.0.0.1:7242/ingest/1c8f892f-924f-4efd-9cbd-58f06c6471cc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase.ts:13',message:'Before client createClient call',data:{urlParam:supabaseUrl.substring(0,30),anonKeyParam:supabaseAnonKey.substring(0,10),urlEmpty:supabaseUrl==='',anonKeyEmpty:supabaseAnonKey===''},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'E'})}).catch(()=>{});
// #endregion

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
