/**
 * 웰컴 이메일 발송 테스트 스크립트
 * 실행: npx tsx --env-file=.env.local scripts/test-email.ts <수신자이메일>
 */
import { sendEmail } from '../src/lib/email/sender';

const to = process.argv[2];
if (!to) {
  console.error('Usage: npx tsx --env-file=.env.local scripts/test-email.ts <email>');
  process.exit(1);
}

console.log(`[test] Sending welcome email to: ${to}`);
console.log(`[test] RESEND_API_KEY: ${process.env.RESEND_API_KEY ? '✓ set' : '✗ missing'}`);
console.log(`[test] RESEND_FROM_EMAIL: ${process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev (fallback)'}`);

sendEmail({ type: 'welcome', to, userName: 'Linkmap 테스터' }).then((ok) => {
  if (ok) {
    console.log('✅ 이메일 발송 성공!');
  } else {
    console.error('❌ 이메일 발송 실패 — 위 로그 확인');
    process.exit(1);
  }
});
