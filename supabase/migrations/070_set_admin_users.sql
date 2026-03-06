-- 070_set_admin_users.sql
-- 관리자 계정 지정 (대시보드 통계에서 제외 목적)
-- service_role로 실행해야 is_admin 보호 트리거를 통과함

SET LOCAL role = 'service_role';

UPDATE profiles
SET is_admin = true
WHERE email IN (
  'cdhnaya@kakao.com',
  'cdhnaya@naver.com',
  'cdhnaya@gmail.com',
  'cdhrich@naver.com',
  'cdhrich@gmail.com',
  'cdhrich@habitree.io',
  'cdhnayajeil@gmail.com',
  'vcdemo@linkmap.site'
);

RESET role;
