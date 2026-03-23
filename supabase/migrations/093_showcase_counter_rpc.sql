-- 093: 쇼케이스 카운터 RPC (RLS 우회)
-- view_count, like_count, comment_count를 비소유자도 증감할 수 있도록 SECURITY DEFINER 함수 생성

CREATE OR REPLACE FUNCTION increment_showcase_counter(
  p_table TEXT,
  p_id UUID,
  p_column TEXT,
  p_delta INTEGER DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 허용된 테이블/컬럼만 처리 (SQL Injection 방지)
  IF p_table NOT IN ('homepage_deploys', 'projects') THEN
    RAISE EXCEPTION 'Invalid table: %', p_table;
  END IF;
  IF p_column NOT IN ('view_count', 'like_count', 'comment_count') THEN
    RAISE EXCEPTION 'Invalid column: %', p_column;
  END IF;

  IF p_table = 'homepage_deploys' THEN
    IF p_column = 'view_count' THEN
      UPDATE homepage_deploys SET view_count = GREATEST(0, COALESCE(view_count, 0) + p_delta) WHERE id = p_id;
    ELSIF p_column = 'like_count' THEN
      UPDATE homepage_deploys SET like_count = GREATEST(0, COALESCE(like_count, 0) + p_delta) WHERE id = p_id;
    ELSIF p_column = 'comment_count' THEN
      UPDATE homepage_deploys SET comment_count = GREATEST(0, COALESCE(comment_count, 0) + p_delta) WHERE id = p_id;
    END IF;
  ELSIF p_table = 'projects' THEN
    IF p_column = 'view_count' THEN
      UPDATE projects SET view_count = GREATEST(0, COALESCE(view_count, 0) + p_delta) WHERE id = p_id;
    ELSIF p_column = 'like_count' THEN
      UPDATE projects SET like_count = GREATEST(0, COALESCE(like_count, 0) + p_delta) WHERE id = p_id;
    ELSIF p_column = 'comment_count' THEN
      UPDATE projects SET comment_count = GREATEST(0, COALESCE(comment_count, 0) + p_delta) WHERE id = p_id;
    END IF;
  END IF;
END;
$$;

-- anon, authenticated 모두 호출 가능
GRANT EXECUTE ON FUNCTION increment_showcase_counter(TEXT, UUID, TEXT, INTEGER) TO anon, authenticated;
