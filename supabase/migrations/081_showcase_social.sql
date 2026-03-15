-- ============================================================
-- Migration 081: 쇼케이스 소셜 기능 (추천/댓글/리더보드)
-- ============================================================

-- 1. showcase_likes: 추천 (유저당 1회)
CREATE TABLE IF NOT EXISTS showcase_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  showcase_id UUID NOT NULL,
  showcase_source TEXT NOT NULL CHECK (showcase_source IN ('deploy', 'project')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(showcase_id, user_id)
);

-- 2. showcase_comments: 댓글
CREATE TABLE IF NOT EXISTS showcase_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  showcase_id UUID NOT NULL,
  showcase_source TEXT NOT NULL CHECK (showcase_source IN ('deploy', 'project')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. 추천수/댓글수 캐시 컬럼 (homepage_deploys)
ALTER TABLE homepage_deploys
  ADD COLUMN IF NOT EXISTS like_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comment_count INTEGER NOT NULL DEFAULT 0;

-- 4. 추천수/댓글수 캐시 컬럼 (projects)
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS like_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comment_count INTEGER NOT NULL DEFAULT 0;

-- 5. 인덱스
CREATE INDEX IF NOT EXISTS idx_showcase_likes_showcase
  ON showcase_likes (showcase_id, showcase_source);
CREATE INDEX IF NOT EXISTS idx_showcase_likes_user
  ON showcase_likes (user_id);
CREATE INDEX IF NOT EXISTS idx_showcase_comments_showcase
  ON showcase_comments (showcase_id, showcase_source, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_showcase_comments_user
  ON showcase_comments (user_id);

-- 리더보드용 인덱스 (homepage_deploys)
CREATE INDEX IF NOT EXISTS idx_homepage_deploys_leaderboard
  ON homepage_deploys (like_count DESC, created_at DESC)
  WHERE is_showcase = true AND deploy_status = 'ready';

-- 리더보드용 인덱스 (projects)
CREATE INDEX IF NOT EXISTS idx_projects_leaderboard
  ON projects (like_count DESC, created_at DESC)
  WHERE is_showcase = true AND deleted_at IS NULL;

-- 6. RLS
ALTER TABLE showcase_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcase_comments ENABLE ROW LEVEL SECURITY;

-- Likes RLS: 누구나 읽기, 인증된 사용자만 본인 좋아요 삽입/삭제
CREATE POLICY "Anyone can view showcase likes"
  ON showcase_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like"
  ON showcase_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike own likes"
  ON showcase_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Comments RLS: 누구나 읽기, 인증된 사용자만 본인 댓글 CRUD
CREATE POLICY "Anyone can view showcase comments"
  ON showcase_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment"
  ON showcase_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments"
  ON showcase_comments FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments"
  ON showcase_comments FOR DELETE
  USING (auth.uid() = user_id);
