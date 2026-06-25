import type { SecureNoteCategory } from '@/types';

/** 보안 메모 분류 — UI 표시용 라벨/설명 */
export const secureNoteCategoryOptions: {
  value: SecureNoteCategory;
  label: string;
  hint: string;
}[] = [
  { value: 'backup_code', label: '백업 코드', hint: '2FA 복구용 일회성 코드 묶음' },
  { value: 'password', label: '비밀번호', hint: '로그인/계정 비밀번호 메모' },
  { value: 'recovery_phrase', label: '복구 문구', hint: '지갑 시드 문구, 복구 키' },
  { value: 'license_key', label: '라이선스 키', hint: '소프트웨어 정품 인증 키' },
  { value: 'connection_string', label: '연결 문자열', hint: 'DB 등 접속 문자열' },
  { value: 'pin', label: 'PIN', hint: '숫자 PIN, 보안 코드' },
  { value: 'api_note', label: 'API 메모', hint: '발급 절차·계정 등 참고 메모' },
  { value: 'other', label: '기타', hint: '그 외 자유 텍스트' },
];

export const secureNoteCategoryLabels: Record<SecureNoteCategory, string> =
  secureNoteCategoryOptions.reduce(
    (acc, o) => { acc[o.value] = o.label; return acc; },
    {} as Record<SecureNoteCategory, string>,
  );

/** 보안 메모 환경 옵션 (all 포함) */
export const secureNoteEnvOptions: { value: string; label: string }[] = [
  { value: 'all', label: '전체 환경' },
  { value: 'development', label: '개발 (Development)' },
  { value: 'staging', label: '스테이징 (Staging)' },
  { value: 'production', label: '프로덕션 (Production)' },
];
