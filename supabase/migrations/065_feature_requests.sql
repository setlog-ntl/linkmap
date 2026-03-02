-- 065_feature_requests.sql
-- 기능 요청 게시판: feature_requests, feature_request_votes, feature_request_comments

-- ─── ENUM TYPES ───────────────────────────────────────────────────────────────

CREATE TYPE feature_request_category AS ENUM ('feature', 'bug', 'improvement');
CREATE TYPE feature_request_status AS ENUM (
  'pending',
  'in_review',
  'planned',
  'in_progress',
  'completed',
  'rejected'
);

-- ─── TABLES ───────────────────────────────────────────────────────────────────

CREATE TABLE feature_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL CHECK (char_length(title) BETWEEN 5 AND 100),
  description     TEXT NOT NULL CHECK (char_length(description) BETWEEN 10 AND 2000),
  category        feature_request_category NOT NULL DEFAULT 'feature',
  status          feature_request_status   NOT NULL DEFAULT 'pending',
  vote_count      INTEGER NOT NULL DEFAULT 0,
  admin_note      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE feature_request_votes (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_request_id  UUID NOT NULL REFERENCES feature_requests(id) ON DELETE CASCADE,
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (feature_request_id, user_id)
);

CREATE TABLE feature_request_comments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_request_id  UUID NOT NULL REFERENCES feature_requests(id) ON DELETE CASCADE,
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content             TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 1000),
  is_admin_comment    BOOLEAN NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── INDEXES ──────────────────────────────────────────────────────────────────

CREATE INDEX idx_feature_requests_status        ON feature_requests(status);
CREATE INDEX idx_feature_requests_category      ON feature_requests(category);
CREATE INDEX idx_feature_requests_vote_count    ON feature_requests(vote_count DESC);
CREATE INDEX idx_feature_requests_created_at    ON feature_requests(created_at DESC);
CREATE INDEX idx_feature_requests_user_id       ON feature_requests(user_id);
CREATE INDEX idx_feature_request_votes_fr_id    ON feature_request_votes(feature_request_id);
CREATE INDEX idx_feature_request_comments_fr_id ON feature_request_comments(feature_request_id);

-- ─── UPDATED_AT TRIGGER ───────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_feature_requests_updated_at
  BEFORE UPDATE ON feature_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_feature_request_comments_updated_at
  BEFORE UPDATE ON feature_request_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── VOTE COUNT SYNC TRIGGER ─────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION sync_feature_request_vote_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE feature_requests
       SET vote_count = vote_count + 1
     WHERE id = NEW.feature_request_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE feature_requests
       SET vote_count = GREATEST(vote_count - 1, 0)
     WHERE id = OLD.feature_request_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_sync_vote_count_insert
  AFTER INSERT ON feature_request_votes
  FOR EACH ROW EXECUTE FUNCTION sync_feature_request_vote_count();

CREATE TRIGGER trg_sync_vote_count_delete
  AFTER DELETE ON feature_request_votes
  FOR EACH ROW EXECUTE FUNCTION sync_feature_request_vote_count();

-- ─── RLS ──────────────────────────────────────────────────────────────────────

ALTER TABLE feature_requests         ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_request_votes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_request_comments ENABLE ROW LEVEL SECURITY;

-- feature_requests: SELECT 공개, INSERT 본인, UPDATE/DELETE 본인
CREATE POLICY "feature_requests_select_public"
  ON feature_requests FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "feature_requests_insert_auth"
  ON feature_requests FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "feature_requests_update_own"
  ON feature_requests FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "feature_requests_delete_own"
  ON feature_requests FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- feature_request_votes: SELECT 공개, INSERT 본인, DELETE 본인
CREATE POLICY "feature_request_votes_select_public"
  ON feature_request_votes FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "feature_request_votes_insert_auth"
  ON feature_request_votes FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "feature_request_votes_delete_own"
  ON feature_request_votes FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- feature_request_comments: SELECT 공개, INSERT 본인, UPDATE 본인, DELETE 본인
CREATE POLICY "feature_request_comments_select_public"
  ON feature_request_comments FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "feature_request_comments_insert_auth"
  ON feature_request_comments FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "feature_request_comments_update_own"
  ON feature_request_comments FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "feature_request_comments_delete_own"
  ON feature_request_comments FOR DELETE TO authenticated
  USING (user_id = auth.uid());
