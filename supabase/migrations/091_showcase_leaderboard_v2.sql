-- 091: Showcase Leaderboard V2
-- 조회수, 이달의 페이지, 관리자 액션, 배지 시스템

-- 1. 기존 테이블에 view_count 컬럼 추가
ALTER TABLE homepage_deploys ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0;

-- 2. 조회 로그 테이블 (30분 중복 방지)
CREATE TABLE IF NOT EXISTS showcase_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  showcase_id UUID NOT NULL,
  showcase_source TEXT NOT NULL CHECK (showcase_source IN ('deploy', 'project')),
  viewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewer_ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. 이달의 페이지
CREATE TABLE IF NOT EXISTS showcase_monthly_picks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  showcase_id UUID NOT NULL,
  showcase_source TEXT NOT NULL CHECK (showcase_source IN ('deploy', 'project')),
  year_month TEXT NOT NULL CHECK (year_month ~ '^\d{4}-\d{2}$'),
  pick_type TEXT NOT NULL CHECK (pick_type IN ('algorithm', 'curated')),
  rank INTEGER NOT NULL CHECK (rank BETWEEN 1 AND 10),
  admin_note TEXT,
  picked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  score_snapshot NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(showcase_id, year_month)
);

-- 4. 관리자 액션
CREATE TABLE IF NOT EXISTS showcase_admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  showcase_id UUID NOT NULL,
  showcase_source TEXT NOT NULL CHECK (showcase_source IN ('deploy', 'project')),
  action_type TEXT NOT NULL CHECK (action_type IN ('boost', 'suppress', 'hide', 'unhide', 'feature', 'unfeature')),
  boost_score NUMERIC DEFAULT 0,
  reason TEXT,
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. 배지
CREATE TABLE IF NOT EXISTS showcase_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL CHECK (badge_type IN (
    'monthly_winner', 'monthly_runner_up', 'editors_choice',
    'popular_creator', 'prolific_creator', 'community_star', 'first_showcase'
  )),
  showcase_id UUID,
  year_month TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 표현식 기반 유니크 → UNIQUE INDEX 사용
CREATE UNIQUE INDEX IF NOT EXISTS idx_showcase_badges_unique
  ON showcase_badges (user_id, badge_type, COALESCE(year_month, ''));

-- ========== RLS ==========

ALTER TABLE showcase_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcase_monthly_picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcase_admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcase_badges ENABLE ROW LEVEL SECURITY;

-- showcase_views: 공개 읽기, 인증+비인증 모두 INSERT 허용
CREATE POLICY "showcase_views_public_read" ON showcase_views
  FOR SELECT USING (true);
CREATE POLICY "showcase_views_auth_insert" ON showcase_views
  FOR INSERT TO authenticated
  WITH CHECK (true);
CREATE POLICY "showcase_views_anon_insert" ON showcase_views
  FOR INSERT TO anon
  WITH CHECK (viewer_ip_hash IS NOT NULL);

-- showcase_monthly_picks: 공개 읽기, 관리자 전용 쓰기 + service_role (자동 선정)
CREATE POLICY "showcase_monthly_picks_public_read" ON showcase_monthly_picks
  FOR SELECT USING (true);
CREATE POLICY "showcase_monthly_picks_admin_insert" ON showcase_monthly_picks
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
CREATE POLICY "showcase_monthly_picks_admin_update" ON showcase_monthly_picks
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
CREATE POLICY "showcase_monthly_picks_admin_delete" ON showcase_monthly_picks
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- showcase_admin_actions: 관리자 전용
CREATE POLICY "showcase_admin_actions_admin_all" ON showcase_admin_actions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- showcase_badges: 공개 읽기, 관리자 전용 쓰기
CREATE POLICY "showcase_badges_public_read" ON showcase_badges
  FOR SELECT USING (true);
CREATE POLICY "showcase_badges_admin_insert" ON showcase_badges
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- ========== RPC: 자동 선정 (SECURITY DEFINER — RLS 우회) ==========

CREATE OR REPLACE FUNCTION auto_pick_monthly_showcase(
  p_year_month TEXT,
  p_month_start TIMESTAMPTZ,
  p_month_end TIMESTAMPTZ
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row RECORD;
  v_rank INTEGER := 0;
BEGIN
  -- 이미 선정되어 있으면 스킵
  IF EXISTS (
    SELECT 1 FROM showcase_monthly_picks WHERE year_month = p_year_month
  ) THEN
    RETURN;
  END IF;

  -- 배포 + 프로젝트 통합 TOP 3
  FOR v_row IN
    SELECT id, 'deploy'::TEXT AS source,
           (COALESCE(like_count,0)*3 + COALESCE(comment_count,0)*2 + COALESCE(view_count,0)*0.1) AS score
    FROM homepage_deploys
    WHERE is_showcase = true AND deploy_status = 'ready'
      AND created_at >= p_month_start AND created_at <= p_month_end
    UNION ALL
    SELECT id, 'project'::TEXT AS source,
           (COALESCE(like_count,0)*3 + COALESCE(comment_count,0)*2 + COALESCE(view_count,0)*0.1) AS score
    FROM projects
    WHERE is_showcase = true AND deleted_at IS NULL
      AND created_at >= p_month_start AND created_at <= p_month_end
    ORDER BY score DESC
    LIMIT 3
  LOOP
    v_rank := v_rank + 1;
    INSERT INTO showcase_monthly_picks
      (showcase_id, showcase_source, year_month, pick_type, rank, score_snapshot)
    VALUES
      (v_row.id, v_row.source, p_year_month, 'algorithm', v_rank, ROUND(v_row.score::NUMERIC, 2))
    ON CONFLICT (showcase_id, year_month) DO NOTHING;
  END LOOP;
END;
$$;

-- ========== 인덱스 ==========

-- 조회 중복 체크 (viewer_id)
CREATE INDEX IF NOT EXISTS idx_showcase_views_dedup_user
  ON showcase_views (showcase_id, viewer_id, created_at DESC)
  WHERE viewer_id IS NOT NULL;

-- 조회 중복 체크 (IP)
CREATE INDEX IF NOT EXISTS idx_showcase_views_dedup_ip
  ON showcase_views (showcase_id, viewer_ip_hash, created_at DESC)
  WHERE viewer_ip_hash IS NOT NULL;

-- 월간 선정 조회
CREATE INDEX IF NOT EXISTS idx_showcase_monthly_picks_month
  ON showcase_monthly_picks (year_month, rank);

-- 활성 관리자 액션
CREATE INDEX IF NOT EXISTS idx_showcase_admin_actions_active
  ON showcase_admin_actions (showcase_id, is_active)
  WHERE is_active = true;

-- 사용자 배지
CREATE INDEX IF NOT EXISTS idx_showcase_badges_user
  ON showcase_badges (user_id, badge_type);

-- 리더보드 v2 (view_count 포함)
CREATE INDEX IF NOT EXISTS idx_homepage_deploys_leaderboard_v2
  ON homepage_deploys (is_showcase, deploy_status, like_count DESC, view_count DESC, created_at DESC)
  WHERE is_showcase = true AND deploy_status = 'ready';

CREATE INDEX IF NOT EXISTS idx_projects_leaderboard_v2
  ON projects (is_showcase, like_count DESC, view_count DESC, created_at DESC)
  WHERE is_showcase = true AND deleted_at IS NULL;
