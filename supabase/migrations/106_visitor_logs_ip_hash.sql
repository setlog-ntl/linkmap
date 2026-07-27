-- 106: visitor_logs 평문 IP 파기 + 해시 저장 전환 (2026-07-16 레드팀 F-7)
--
-- 문제: /api/track이 방문자 IP를 평문으로 저장하는데 보존기간·파기 절차가 없어
--       개인정보가 무기한 축적된다(점검 시점 1,918건, 최古 2026-03-02).
-- 조치: ① 이미 쌓인 평문 IP를 파기하고
--       ② 컬럼 용도를 "SHA-256 해시"로 전환한다(앱 측 /api/track이 해시를 기록).
--
-- 해시는 원본 IP를 복원할 수 없으므로 중복 방문 판별 등 통계 용도는 유지되면서
-- 식별자 자체는 저장하지 않는다. 기존 행은 원본이 없어 재계산이 불가하므로 NULL 처리.
--
-- 한계(문서화 목적): 고정 솔트 기반 해시는 IPv4 전수 대입에 이론상 취약하다.
--   showcase_views.viewer_ip_hash와 동일한 수준이며, 비밀 솔트 도입은 별도 과제.

UPDATE public.visitor_logs
  SET ip_address = NULL
  WHERE ip_address IS NOT NULL;

COMMENT ON COLUMN public.visitor_logs.ip_address IS
  'SHA-256 해시된 방문자 IP (평문 저장 금지 — 2026-07-16 레드팀 F-7). 106 이전 행은 파기되어 NULL.';
