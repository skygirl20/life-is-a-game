-- Life As A Game - Supabase 테이블 스키마 v2
-- 회원가입/로그인 시스템 포함
-- 이 스크립트를 Supabase SQL Editor에서 실행하세요

-- 기존 테이블 삭제 (주의: 데이터가 모두 삭제됩니다)
DROP TABLE IF EXISTS daily_logs CASCADE;
DROP TABLE IF EXISTS characters CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- users 테이블 생성
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- characters 테이블 생성 (user_id 외래키 추가)
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  level INT NOT NULL DEFAULT 1,
  xp INT NOT NULL DEFAULT 0,
  focus INT NOT NULL DEFAULT 0,
  health INT NOT NULL DEFAULT 0,
  mental INT NOT NULL DEFAULT 0,
  growth INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id) -- 한 사용자당 하나의 캐릭터만
);

-- daily_logs 테이블 생성
CREATE TABLE daily_logs (
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
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_daily_logs_character_id ON daily_logs(character_id);
CREATE INDEX idx_daily_logs_log_date ON daily_logs(log_date);
CREATE INDEX idx_users_user_id ON users(user_id);

-- Row Level Security (RLS) 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- RLS 정책: MVP용으로 모든 접근 허용
-- (추후 사용자별 접근 제어로 변경 가능)
CREATE POLICY "Enable all access for users" ON users FOR ALL USING (true);
CREATE POLICY "Enable all access for characters" ON characters FOR ALL USING (true);
CREATE POLICY "Enable all access for daily_logs" ON daily_logs FOR ALL USING (true);

-- 완료!
-- 이제 .env.local에 환경 변수를 설정하고 애플리케이션을 실행하세요
