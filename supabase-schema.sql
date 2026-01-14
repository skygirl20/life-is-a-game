-- Life As A Game - Supabase 테이블 스키마
-- 이 스크립트를 Supabase SQL Editor에서 실행하세요

-- characters 테이블 생성
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  level INT NOT NULL DEFAULT 1,
  xp INT NOT NULL DEFAULT 0,
  focus INT NOT NULL DEFAULT 0,
  health INT NOT NULL DEFAULT 0,
  mental INT NOT NULL DEFAULT 0,
  growth INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- daily_logs 테이블 생성
CREATE TABLE IF NOT EXISTS daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  raw_text TEXT NOT NULL,
  focus_delta INT NOT NULL,
  health_delta INT NOT NULL,
  mental_delta INT NOT NULL,
  growth_delta INT NOT NULL,
  xp_gained INT NOT NULL,
  ai_comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_daily_logs_character_id ON daily_logs(character_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_log_date ON daily_logs(log_date);

-- Row Level Security (RLS) 활성화
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 모든 데이터를 읽고 쓸 수 있도록 설정 (로그인 없는 MVP용)
CREATE POLICY "Enable all access for characters" ON characters FOR ALL USING (true);
CREATE POLICY "Enable all access for daily_logs" ON daily_logs FOR ALL USING (true);

-- 완료!
-- 이제 .env.local에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정하세요
