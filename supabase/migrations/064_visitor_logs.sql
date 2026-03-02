-- 064: visitor_logs — 비인증 방문자 페이지 접속 기록
CREATE TABLE visitor_logs (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text        NOT NULL,
  page_path  text        NOT NULL,
  referrer   text,
  user_agent text,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE visitor_logs ENABLE ROW LEVEL SECURITY;

-- anon/authenticated 모두 INSERT 허용 (공개 트래킹)
CREATE POLICY "public_insert_visitor_logs" ON visitor_logs
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- SELECT는 RLS 차단 → admin API가 service_role로 우회
CREATE INDEX visitor_logs_created_at_idx ON visitor_logs(created_at DESC);
CREATE INDEX visitor_logs_session_id_idx ON visitor_logs(session_id);
