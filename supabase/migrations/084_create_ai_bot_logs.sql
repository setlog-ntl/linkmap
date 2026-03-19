-- AI 봇 크롤링 로그 테이블
CREATE TABLE IF NOT EXISTS ai_bot_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_name text NOT NULL,
  path text NOT NULL,
  user_agent text,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 인덱스: 봇별·날짜별 조회 최적화
CREATE INDEX idx_ai_bot_logs_bot_name ON ai_bot_logs (bot_name);
CREATE INDEX idx_ai_bot_logs_created_at ON ai_bot_logs (created_at DESC);

-- RLS 활성화
ALTER TABLE ai_bot_logs ENABLE ROW LEVEL SECURITY;

-- 정책: service_role만 INSERT 가능 (middleware에서 service_role_key 사용)
CREATE POLICY "Service role can insert ai_bot_logs"
  ON ai_bot_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- 정책: service_role만 SELECT 가능 (관리자 대시보드 조회용)
CREATE POLICY "Service role can read ai_bot_logs"
  ON ai_bot_logs
  FOR SELECT
  TO service_role
  USING (true);
