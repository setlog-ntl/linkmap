-- 073_feature_requests_page_context.sql
-- 피드백에 페이지 컨텍스트 정보 저장 (어느 페이지에서 보낸 피드백인지)

ALTER TABLE feature_requests
  ADD COLUMN page_context TEXT;

-- 인덱스: 페이지별 피드백 조회용
CREATE INDEX idx_feature_requests_page_context ON feature_requests(page_context)
  WHERE page_context IS NOT NULL;
