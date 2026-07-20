-- 105: increment_showcase_counter delta 클램프 (2026-07-16 레드팀 F-8)
--
-- 문제: 093이 만든 RPC는 SECURITY DEFINER + anon GRANT 상태에서 p_delta 상한이 없어,
--       anon이 PostgREST로 직접 `p_delta: 999999`를 호출해 임의 쇼케이스의
--       좋아요/조회/댓글 수를 조작할 수 있다(리더보드·이달의 페이지·배지 왜곡).
-- 조치: 정상 호출은 전부 ±1(좋아요/취소, 조회 +1, 댓글 ±1)이므로 delta를 [-1, 1]로
--       클램프한다. 호출부 변경 불필요(투명). GRANT/시그니처는 093 그대로 유지.

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

  -- delta를 ±1로 제한 — 임의 값 조작 차단 (F-8)
  p_delta := GREATEST(-1, LEAST(1, p_delta));

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

-- GRANT는 093에서 유지되나 명시적으로 재확인
GRANT EXECUTE ON FUNCTION increment_showcase_counter(TEXT, UUID, TEXT, INTEGER) TO anon, authenticated;
