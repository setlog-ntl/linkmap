-- 033: RBAC for GitHub connection management
-- 프로젝트 팀 멤버 역할별 접근 제어

-- 1. project_github_repos에 팀 editor UPDATE 정책 추가
CREATE POLICY "project_github_repos_team_editor"
  ON project_github_repos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN team_members tm ON tm.team_id = p.team_id
      WHERE p.id = project_id
        AND tm.user_id = auth.uid()
        AND tm.role IN ('admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN team_members tm ON tm.team_id = p.team_id
      WHERE p.id = project_id
        AND tm.user_id = auth.uid()
        AND tm.role IN ('admin', 'editor')
    )
  );

-- 2. project_github_repos에 팀 viewer 읽기 전용 정책
CREATE POLICY "project_github_repos_team_viewer"
  ON project_github_repos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN team_members tm ON tm.team_id = p.team_id
      WHERE p.id = project_id
        AND tm.user_id = auth.uid()
    )
  );
