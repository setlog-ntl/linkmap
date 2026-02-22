-- =============================================
-- M042: Custom Services (사용자 커스텀 서비스)
-- =============================================
-- services 테이블에 user_id, is_custom, icon_emoji 컬럼 추가
-- 기존 FK 100% 유지, 승격 시 UPDATE 한 줄로 해결

-- 1) 컬럼 추가
ALTER TABLE services ADD COLUMN user_id UUID REFERENCES auth.users(id) DEFAULT NULL;
ALTER TABLE services ADD COLUMN is_custom BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE services ADD COLUMN icon_emoji TEXT;

-- 2) 인덱스
CREATE INDEX idx_services_user_id ON services(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_services_is_custom ON services(is_custom) WHERE is_custom = true;

-- 3) RLS 정책 교체
DROP POLICY IF EXISTS "Authenticated users can view services" ON services;

-- 글로벌 서비스: 인증 사용자 전체 읽기
CREATE POLICY "read_global_services" ON services
  FOR SELECT TO authenticated
  USING (is_custom = false);

-- 커스텀 서비스: 본인 읽기
CREATE POLICY "read_own_custom_services" ON services
  FOR SELECT TO authenticated
  USING (is_custom = true AND user_id = auth.uid());

-- 커스텀 서비스: 같은 프로젝트 팀원 읽기
CREATE POLICY "read_team_custom_services" ON services
  FOR SELECT TO authenticated
  USING (
    is_custom = true AND EXISTS (
      SELECT 1 FROM project_services ps
      JOIN projects p ON p.id = ps.project_id
      LEFT JOIN team_members tm ON tm.team_id = p.team_id
      WHERE ps.service_id = services.id
        AND (p.user_id = auth.uid() OR tm.user_id = auth.uid())
    )
  );

-- 커스텀 서비스: CRUD (본인만)
CREATE POLICY "insert_own_custom_services" ON services
  FOR INSERT TO authenticated
  WITH CHECK (is_custom = true AND user_id = auth.uid());

CREATE POLICY "update_own_custom_services" ON services
  FOR UPDATE TO authenticated
  USING (is_custom = true AND user_id = auth.uid())
  WITH CHECK (is_custom = true AND user_id = auth.uid());

CREATE POLICY "delete_own_custom_services" ON services
  FOR DELETE TO authenticated
  USING (is_custom = true AND user_id = auth.uid());
