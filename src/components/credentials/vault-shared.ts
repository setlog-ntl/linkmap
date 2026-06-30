import { Key, UserCheck, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CredentialPurpose, VaultKind } from '@/types';

/** 비밀키 용도 옵션 */
export const purposeOptions: { value: CredentialPurpose; label: string }[] = [
  { value: 'admin', label: '관리자 계정' },
  { value: 'demo', label: '데모 계정' },
  { value: 'deploy', label: '배포 계정' },
  { value: 'monitoring', label: '모니터링 계정' },
  { value: 'api', label: 'API 계정' },
  { value: 'other', label: '기타' },
];

/** 비밀키·보안메모 환경 옵션 (all 포함) */
export const allEnvOptions: { value: string; label: string }[] = [
  { value: 'all', label: '전체 환경' },
  { value: 'development', label: 'Development' },
  { value: 'staging', label: 'Staging' },
  { value: 'production', label: 'Production' },
];

/** 환경변수 환경 옵션 (all 없음) */
export const envOnlyOptions: { value: string; label: string }[] = [
  { value: 'development', label: 'Development' },
  { value: 'staging', label: 'Staging' },
  { value: 'production', label: 'Production' },
];

export interface KindMeta {
  label: string;
  icon: LucideIcon;
  /** 아이콘/배지 색상 토큰 */
  tone: string;
}

export const kindMeta: Record<VaultKind, KindMeta> = {
  env: { label: '환경변수', icon: Key, tone: 'text-brand-blue' },
  credential: { label: '비밀키', icon: UserCheck, tone: 'text-brand-green' },
  note: { label: '보안메모', icon: ShieldCheck, tone: 'text-amber-500' },
};

/** 비밀번호 강도 측정 (credentials 페이지 로직 재사용) */
export function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score += 20;
  if (pw.length >= 12) score += 10;
  if (pw.length >= 16) score += 10;
  if (/[a-z]/.test(pw)) score += 10;
  if (/[A-Z]/.test(pw)) score += 15;
  if (/\d/.test(pw)) score += 15;
  if (/[^a-zA-Z0-9]/.test(pw)) score += 20;
  score = Math.min(score, 100);
  if (score < 30) return { score, label: '매우 약함', color: 'bg-red-500' };
  if (score < 50) return { score, label: '약함', color: 'bg-orange-500' };
  if (score < 70) return { score, label: '보통', color: 'bg-yellow-500' };
  if (score < 90) return { score, label: '강함', color: 'bg-green-500' };
  return { score, label: '매우 강함', color: 'bg-emerald-500' };
}
