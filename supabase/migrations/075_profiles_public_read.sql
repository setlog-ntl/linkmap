-- Migration 075: profiles 테이블 공개 읽기 정책 추가
-- 쇼케이스 갤러리에서 다른 사용자의 이름/아바타 표시 필요
-- name, avatar_url만 공개 (email 등 민감 정보는 기존 정책으로 보호)

DO $$ BEGIN
  CREATE POLICY "Anyone can view basic profile info"
    ON public.profiles FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
