// 서버 전용 Supabase 클라이언트 (Service Role Key 사용)
// RLS를 우회하여 API 라우트에서 데이터베이스 접근 가능
import { createClient } from '@supabase/supabase-js';

// 지연 초기화를 위한 클라이언트 캐시
let supabaseServerInstance: ReturnType<typeof createClient> | null = null;

// 서버 전용 클라이언트 가져오기 (지연 초기화)
function getSupabaseServer(): ReturnType<typeof createClient> {
  if (supabaseServerInstance) {
    return supabaseServerInstance;
  }

  // #region agent log
  const allEnvKeys = Object.keys(process.env).filter(k => k.includes('SUPABASE'));
  fetch('http://127.0.0.1:7242/ingest/1c8f892f-924f-4efd-9cbd-58f06c6471cc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase-server.ts:getSupabaseServer',message:'All Supabase env keys found',data:{allKeys:allEnvKeys,hasServiceRoleKey:allEnvKeys.includes('SUPABASE_SERVICE_ROLE_KEY'),hasUrl:allEnvKeys.includes('NEXT_PUBLIC_SUPABASE_URL')},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'F,I'})}).catch(()=>{});
  // #endregion

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/1c8f892f-924f-4efd-9cbd-58f06c6471cc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase-server.ts:getSupabaseServer',message:'Server env vars loaded',data:{urlExists:!!supabaseUrl,urlLength:supabaseUrl.length,keyExists:!!supabaseServiceRoleKey,keyLength:supabaseServiceRoleKey.length,urlValue:supabaseUrl.substring(0,30),keyPrefix:supabaseServiceRoleKey.substring(0,10),keyFirstChar:supabaseServiceRoleKey.charAt(0),keyLastChar:supabaseServiceRoleKey.charAt(supabaseServiceRoleKey.length-1)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A,B,C,H'})}).catch(()=>{});
  // #endregion

  // 환경 변수 확인
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.warn('⚠️ Supabase 서버 환경 변수가 설정되지 않았습니다.');
    console.warn('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
    console.warn('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceRoleKey ? '✅' : '❌');
    throw new Error('Supabase 서버 환경 변수가 설정되지 않았습니다.');
  }

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/1c8f892f-924f-4efd-9cbd-58f06c6471cc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase-server.ts:getSupabaseServer',message:'Before createClient call',data:{urlParam:supabaseUrl.substring(0,30),keyParam:supabaseServiceRoleKey.substring(0,10),urlEmpty:supabaseUrl==='',keyEmpty:supabaseServiceRoleKey===''},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'E'})}).catch(()=>{});
  // #endregion

  // 서버 전용 클라이언트 생성 (RLS 우회)
  supabaseServerInstance = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseServerInstance;
}

// 호환성을 위한 export (기존 코드와의 호환)
export const supabaseServer = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    return getSupabaseServer()[prop as keyof ReturnType<typeof createClient>];
  },
});
