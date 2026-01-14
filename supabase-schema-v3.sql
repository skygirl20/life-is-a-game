-- Life As A Game - Supabase 테이블 스키마 (v3)
-- Supabase Auth 사용 버전 (보안 강화)
-- 이 스크립트를 Supabase SQL Editor에서 실행하세요

-- 기존 테이블이 있다면 삭제 (마이그레이션 시)
-- DROP TABLE IF EXISTS daily_logs CASCADE;
-- DROP TABLE IF EXISTS characters CASCADE;
-- DROP TABLE IF EXISTS users CASCADE; -- v2에서 만든 테이블 제거

-- characters 테이블 생성
-- user_id는 auth.users.id를 참조 (Supabase Auth가 자동 관리)
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- Supabase Auth 연동
  nickname TEXT NOT NULL,
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
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
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
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_character_id ON daily_logs(character_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_log_date ON daily_logs(log_date);

-- Row Level Security (RLS) 활성화
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- RLS 정책 삭제 (기존 정책이 있다면)
DROP POLICY IF EXISTS "Users can view their own characters." ON characters;
DROP POLICY IF EXISTS "Users can insert their own characters." ON characters;
DROP POLICY IF EXISTS "Users can update their own characters." ON characters;
DROP POLICY IF EXISTS "Users can delete their own characters." ON characters;
DROP POLICY IF EXISTS "Users can view their own daily logs." ON daily_logs;
DROP POLICY IF EXISTS "Users can insert their own daily logs." ON daily_logs;
DROP POLICY IF EXISTS "Users can update their own daily logs." ON daily_logs;
DROP POLICY IF EXISTS "Users can delete their own daily logs." ON daily_logs;

-- characters 테이블 RLS 정책
-- auth.uid()는 Supabase Auth가 제공하는 현재 로그인 사용자 ID
CREATE POLICY "Users can view their own characters."
  ON characters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own characters."
  ON characters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own characters."
  ON characters FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own characters."
  ON characters FOR DELETE
  USING (auth.uid() = user_id);

-- daily_logs 테이블 RLS 정책
CREATE POLICY "Users can view their own daily logs."
  ON daily_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM characters
      WHERE id = daily_logs.character_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own daily logs."
  ON daily_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM characters
      WHERE id = daily_logs.character_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own daily logs."
  ON daily_logs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM characters
      WHERE id = daily_logs.character_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own daily logs."
  ON daily_logs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM characters
      WHERE id = daily_logs.character_id
      AND user_id = auth.uid()
    )
  );

-- 완료!
-- 이제 Supabase Auth를 사용하여 안전한 인증 시스템이 구축되었습니다.
-- 
-- Supabase Auth 설정 (Dashboard에서):
-- 1. Authentication > Providers > Email 활성화
-- 2. Authentication > Settings > Email Auth 설정
--    - "Enable email confirmations" 비활성화 (MVP용)
-- 3. .env.local에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY 설정
