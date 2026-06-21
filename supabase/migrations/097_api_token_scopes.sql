-- Migration 097: API 토큰에 스코프(scopes) 컬럼 추가
-- MCP 서비스 동기화 기능에서 토큰 권한 분리를 위해 필요

ALTER TABLE api_tokens
ADD COLUMN IF NOT EXISTS scopes TEXT[] NOT NULL DEFAULT '{read,write}';

-- 유효한 스코프 값만 허용
ALTER TABLE api_tokens
ADD CONSTRAINT api_tokens_valid_scopes
CHECK (scopes <@ ARRAY['read', 'write', 'admin']::TEXT[]);

-- 기존 토큰은 기본 read,write 권한 유지 (DEFAULT로 처리됨)

COMMENT ON COLUMN api_tokens.scopes IS 'API 토큰 권한 범위: read(조회), write(수정), admin(관리)';
