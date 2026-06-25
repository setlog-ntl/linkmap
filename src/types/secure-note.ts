import type { Environment } from './core';

/** 보안 메모 분류 — 자유 텍스트 민감값의 성격 */
export type SecureNoteCategory =
  | 'backup_code'
  | 'password'
  | 'recovery_phrase'
  | 'license_key'
  | 'connection_string'
  | 'pin'
  | 'api_note'
  | 'other';

/**
 * 보안 메모 — KEY=VALUE 가 아닌 자유 텍스트 민감값.
 * 본문(content)은 AES-256-GCM 암호화되어 encrypted_content 로 저장된다.
 */
export interface SecureNote {
  id: string;
  project_id: string;
  service_id: string | null;
  title: string;
  category: SecureNoteCategory;
  encrypted_content: string;
  environment: Environment | 'all';
  notes: string | null;
  created_at: string;
  updated_at: string;
}
