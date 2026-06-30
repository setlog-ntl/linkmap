import type { EnvironmentVariable } from './env';
import type { ServiceCredential } from './credential';
import type { SecureNote } from './secure-note';

/** 비밀키 관리 허브에서 다루는 민감값 3종 */
export type VaultKind = 'env' | 'credential' | 'note';

/**
 * 허브에서 환경변수·비밀키·보안메모를 하나의 목록으로 표시하기 위한 공통 표시 모델.
 * DB/API는 3개로 분리돼 있고, 이 타입은 UI 레이어 병합 전용이다.
 */
export interface VaultItem {
  /** `${kind}:${id}` — reveal/선택 상태의 키 충돌 방지용 */
  key: string;
  kind: VaultKind;
  id: string;
  serviceId: string | null;
  /** 평문 식별자: key_name / label / title */
  title: string;
  /** 보조 라벨: 용도(비밀키)·분류(보안메모) 라벨. 환경변수는 null */
  subtitle: string | null;
  /** 'all' | 'development' | 'staging' | 'production' */
  environment: string;
  createdAt: string;
  updatedAt: string;
  /** 원본 객체 — 편집/삭제/복호화 위임용 */
  raw: EnvironmentVariable | ServiceCredential | SecureNote;
}

/** 복호화(보기) 결과 — kind별 형태가 다르다 */
export type RevealedValue =
  | { kind: 'env' | 'note'; value: string }
  | { kind: 'credential'; username?: string; password?: string };
