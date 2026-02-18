import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAccountSchema } from '@/lib/validations/service-account';
import { unauthorizedError, validationError, apiError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { decrypt } from '@/lib/crypto';
import { safeDecryptToken } from '@/lib/github/token';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = verifyAccountSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { service_account_id } = parsed.data;

  // Fetch account with encrypted fields
  const { data: account } = await supabase
    .from('service_accounts')
    .select('*')
    .eq('id', service_account_id)
    .single();

  if (!account) return apiError('계정을 찾을 수 없습니다', 404);

  // Verify project ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', account.project_id)
    .eq('user_id', user.id)
    .single();

  if (!project) return apiError('권한이 없습니다', 403);

  let verifyStatus: 'active' | 'error' = 'active';
  let errorMessage: string | null = null;

  try {
    if (account.connection_type === 'api_key' && account.encrypted_api_key) {
      const apiKeysJson = decrypt(account.encrypted_api_key);
      const apiKeys = JSON.parse(apiKeysJson) as Record<string, string>;

      // Fetch the service slug to determine verify endpoint
      const { data: service } = await supabase
        .from('services')
        .select('slug')
        .eq('id', account.service_id)
        .single();

      if (service) {
        // Dynamic import to avoid circular dependency
        const { getConnectionConfig } = await import('@/data/service-connections');
        const config = getConnectionConfig(service.slug);

        if (config.verify_url) {
          // Use the first API key for verification
          const firstKey = Object.values(apiKeys)[0];
          const verifyRes = await fetch(config.verify_url, {
            headers: {
              Authorization: `Bearer ${firstKey}`,
              'User-Agent': 'Linkmap/1.0',
            },
            signal: AbortSignal.timeout(10000),
          });

          if (!verifyRes.ok) {
            verifyStatus = 'error';
            errorMessage = `검증 실패: HTTP ${verifyRes.status}`;
          }
        }
      }
    } else if (account.connection_type === 'oauth' && account.encrypted_access_token) {
      const decryptResult = await safeDecryptToken(account.encrypted_access_token, supabase, account.id);
      if ('error' in decryptResult) {
        verifyStatus = 'error';
        errorMessage = decryptResult.error;
      } else {
        const accessToken = decryptResult.token;

        // Check token expiry
        if (account.token_expires_at && new Date(account.token_expires_at) < new Date()) {
          verifyStatus = 'error';
          errorMessage = '토큰이 만료되었습니다';
        } else {
          // Try GitHub user endpoint as default OAuth verification
          const verifyRes = await fetch('https://api.github.com/user', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'User-Agent': 'Linkmap/1.0',
            },
            signal: AbortSignal.timeout(10000),
          });

          if (!verifyRes.ok) {
            verifyStatus = 'error';
            errorMessage = `OAuth 검증 실패: HTTP ${verifyRes.status}`;
          }
        }
      }
    }
  } catch (err) {
    verifyStatus = 'error';
    errorMessage = err instanceof Error ? err.message : '검증 중 오류가 발생했습니다';
  }

  // Update status
  await supabase
    .from('service_accounts')
    .update({
      status: verifyStatus,
      last_verified_at: new Date().toISOString(),
      error_message: errorMessage,
      updated_at: new Date().toISOString(),
    })
    .eq('id', service_account_id);

  await logAudit(user.id, {
    action: 'service_account.verify',
    resourceType: 'service_account',
    resourceId: service_account_id,
    details: { status: verifyStatus, error: errorMessage },
  });

  return NextResponse.json({ status: verifyStatus, error_message: errorMessage });
}
