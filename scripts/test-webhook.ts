/**
 * Supabase 테스트 유저 생성 → 웹훅 트리거 → 웰컴 이메일 발송 확인
 * 실행: npx tsx --env-file=.env.local scripts/test-webhook.ts
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY 미설정');
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const testEmail = `webhook-test-${Date.now()}@linkmap.biz`;
console.log(`[test] 테스트 유저 생성: ${testEmail}`);

admin.auth.admin.createUser({
  email: testEmail,
  email_confirm: true,
  user_metadata: { full_name: 'Webhook 테스터' },
}).then(async ({ data, error }) => {
  if (error) {
    console.error('❌ 유저 생성 실패:', error.message);
    process.exit(1);
  }

  console.log('✅ 유저 생성 성공 — Supabase 웹훅이 트리거됩니다.');
  console.log('   User ID:', data.user?.id);
  console.log('   → cdhrich2@gmail.com 이 아닌 내부 테스트 계정이므로');
  console.log('   → 웰컴 이메일은 Supabase 웹훅이 /api/auth/webhook 으로 전송합니다.');
  console.log('\n[cleanup] 테스트 유저 삭제 중...');

  // 테스트 유저 정리
  if (data.user?.id) {
    const { error: delErr } = await admin.auth.admin.deleteUser(data.user.id);
    if (delErr) {
      console.warn('⚠️  유저 삭제 실패 (Supabase 대시보드에서 수동 삭제 필요):', delErr.message);
    } else {
      console.log('✅ 테스트 유저 삭제 완료');
    }
  }

  console.log('\n📧 https://linkmap.biz 에서 신규 가입 시 cdhrich2@gmail.com 으로 웰컴 이메일이 발송되는지 확인하세요.');
});
