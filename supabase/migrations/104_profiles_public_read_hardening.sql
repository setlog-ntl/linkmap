-- 104: profiles 공개 읽기 정책(075) 제거 — 전 컬럼 노출 방지 (2026-07-16 레드팀 F-1)
--
-- 문제: 075의 `USING (true)` SELECT 정책은 RLS가 컬럼 단위 제한을 못 하므로
--       profiles의 email·is_admin·mfa_enabled까지 anon에 전면 개방한다.
--       (라이브 DB에는 미적용 상태였으나, 마이그레이션 셋에 남아 있어 db push 시 사고화)
-- 조치: 해당 정책을 제거하고 소유자 전용(self-read/self-update) 정책만 남긴다.
--
-- 참고: 쇼케이스 등에서 타 사용자의 이름/아바타를 공개 표시하는 기능은 별도 과제로 분리.
--       구현 시 security_definer 뷰는 advisor ERROR(0010)를 유발하고 PostgREST FK 임베딩이
--       안 되므로, denormalized 테이블(id/name/avatar_url) + SELECT USING(true) +
--       profiles 동기화 트리거 방식으로 구현할 것(advisor-clean + 임베딩 가능).

DROP POLICY IF EXISTS "Anyone can view basic profile info" ON public.profiles;
