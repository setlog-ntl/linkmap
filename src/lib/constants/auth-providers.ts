/** Supabase Auth provider 코드 → 사람이 읽는 로그인 방식 이름 */
const PROVIDER_LABELS: Record<string, string> = {
  google: '구글 로그인',
  github: 'GitHub 로그인',
  email: '이메일 로그인',
};

export function getProviderLabel(provider: string | null): string {
  if (!provider) return '로그인 방식 미상';
  return PROVIDER_LABELS[provider] ?? provider;
}
