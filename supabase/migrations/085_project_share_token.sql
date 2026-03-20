-- 서비스맵 공유 링크 기능
ALTER TABLE projects
  ADD COLUMN share_token text UNIQUE,
  ADD COLUMN is_map_shared boolean NOT NULL DEFAULT false,
  ADD COLUMN shared_at timestamptz;

-- 부분 인덱스: 토큰이 있는 행만 인덱싱
CREATE UNIQUE INDEX idx_projects_share_token
  ON projects(share_token) WHERE share_token IS NOT NULL;

-- 공유된 프로젝트는 누구나 읽기 가능 (맵 데이터 API에서 사용)
CREATE POLICY "shared_map_public_read" ON projects
  FOR SELECT USING (is_map_shared = true AND share_token IS NOT NULL);
