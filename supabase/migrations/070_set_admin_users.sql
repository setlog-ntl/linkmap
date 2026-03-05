-- 070_set_admin_users.sql
-- 관리자 계정 지정 (대시보드 통계에서 제외 목적)

UPDATE profiles
SET is_admin = true
WHERE email IN (
  'cdhnaya@kakao.com',
  'cdhnaya@naver.com',
  'cdhrich@naver.com',
  'cdhrich@habitree.io',
  'cdhnayajeil@gmail.com',
  'vcdemo@linkmap.site'
);
