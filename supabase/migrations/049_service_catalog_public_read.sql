-- ============================================================
-- 서비스 카탈로그 공개 읽기 RLS 수정
-- 기존: authenticated 사용자만 SELECT 가능
-- 변경: anon(비로그인) 포함 누구나 글로벌 카탈로그 데이터 읽기 가능
-- 이유: /services 페이지는 공개 마케팅 페이지이므로
--       비로그인 상태에서도 서비스 가이드/가격/의존성이 표시되어야 함
-- ============================================================

-- 1. services: anon도 글로벌 서비스(is_custom=false) 읽기 가능
CREATE POLICY "anon_read_global_services"
  ON services
  FOR SELECT
  TO anon
  USING (is_custom = false);

-- 2. service_guides: 기존 정책 교체 → 누구나 읽기 가능
DROP POLICY "Authenticated users can view guides" ON service_guides;
CREATE POLICY "public_read_service_guides"
  ON service_guides
  FOR SELECT
  USING (true);

-- 3. service_cost_tiers: 기존 정책 교체 → 누구나 읽기 가능
DROP POLICY "Authenticated users can view cost tiers" ON service_cost_tiers;
CREATE POLICY "public_read_service_cost_tiers"
  ON service_cost_tiers
  FOR SELECT
  USING (true);

-- 4. service_dependencies: 기존 정책 교체 → 누구나 읽기 가능
DROP POLICY "Authenticated users can view dependencies" ON service_dependencies;
CREATE POLICY "public_read_service_dependencies"
  ON service_dependencies
  FOR SELECT
  USING (true);
