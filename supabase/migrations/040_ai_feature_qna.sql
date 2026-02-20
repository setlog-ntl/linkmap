-- AI Feature Q&A table: per-feature quick questions with answer guides
CREATE TABLE IF NOT EXISTS ai_feature_qna (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_slug TEXT NOT NULL REFERENCES ai_feature_personas(feature_slug) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_ko TEXT,
  answer_guide TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE ai_feature_qna ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "admin_full_access" ON ai_feature_qna
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Authenticated users can read active Q&A
CREATE POLICY "authenticated_read_active" ON ai_feature_qna
  FOR SELECT USING (
    auth.role() = 'authenticated' AND is_active = true
  );

-- Index for fast feature_slug lookups
CREATE INDEX idx_ai_feature_qna_slug ON ai_feature_qna(feature_slug);

-- Seed default Q&A per feature
INSERT INTO ai_feature_qna (feature_slug, question, question_ko, answer_guide, sort_order) VALUES
  -- overview_chat
  ('overview_chat', 'Recommend services for my project', '프로젝트에 적합한 서비스 추천해줘', '사용자의 프로젝트 정보(이름, 현재 서비스, 환경변수 수)를 분석하여 부족한 레이어의 서비스를 추천하세요. 반드시 recommendations JSON 블록을 포함하세요.', 1),
  ('overview_chat', 'Analyze my architecture', '현재 아키텍처를 분석해줘', '프로젝트에 연결된 서비스 목록과 연결 상태를 기반으로 아키텍처의 강점과 개선점을 분석하세요. 누락된 레이어나 단일 장애점을 지적하세요.', 2),
  ('overview_chat', 'Explain env variable best practices', '환경변수 관리 모범 사례 알려줘', '환경변수 네이밍 규칙, 시크릿 관리, .env 파일 구조, 서비스별 환경변수 분리 방법을 설명하세요.', 3),
  -- env_doctor
  ('env_doctor', 'Check for missing env vars', '누락된 환경변수 확인해줘', '프로젝트의 서비스 목록과 현재 환경변수를 비교하여 누락된 필수 환경변수를 찾아 목록으로 제시하세요.', 1),
  ('env_doctor', 'Find duplicate or conflicting values', '중복되거나 충돌하는 값 찾아줘', '환경변수 이름과 값을 분석하여 중복된 키, 충돌하는 설정, 비표준 네이밍을 찾아 수정 방안을 제시하세요.', 2),
  -- map_narrator
  ('map_narrator', 'Describe my service architecture', '서비스 아키텍처를 설명해줘', '서비스맵에 표시된 서비스들의 역할과 연결 관계를 분석하여 전체 아키텍처를 이야기 형식으로 설명하세요.', 1),
  ('map_narrator', 'Find potential issues in the map', '서비스맵에서 잠재적 문제 찾아줘', '서비스 간 연결 패턴, 의존성 깊이, 단일 장애점, 순환 의존성 등을 분석하여 잠재적 문제를 진단하세요.', 2),
  -- compare_services
  ('compare_services', 'Compare these services objectively', '이 서비스들을 객관적으로 비교해줘', '선택된 서비스들의 가격, 기능, 확장성, 커뮤니티 지원, 학습 곡선을 표 형식으로 비교하세요.', 1),
  ('compare_services', 'Which one fits my project best?', '내 프로젝트에 가장 적합한 것은?', '프로젝트의 규모, 기술 스택, 팀 역량을 고려하여 가장 적합한 서비스를 추천하고 그 이유를 설명하세요.', 2),
  -- command
  ('command', 'What commands are available?', '사용 가능한 명령어가 뭐야?', '사용 가능한 자연어 명령어 목록(서비스 추가/제거, 환경변수 생성, 연결 관리 등)을 안내하세요.', 1),
  -- module_suggest
  ('module_suggest', 'Suggest modules for my site', '내 사이트에 적합한 모듈 추천해줘', '사이트의 목적과 현재 모듈 구성을 분석하여 추가하면 좋을 모듈을 추천하고 배치 순서를 제안하세요.', 1),
  ('module_suggest', 'Optimize module order', '모듈 순서를 최적화해줘', '현재 모듈 순서를 사용자 경험과 전환율 관점에서 분석하여 최적의 순서를 제안하세요.', 2);
