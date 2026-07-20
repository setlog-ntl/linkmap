/**
 * Service role Supabase client for server-side operations that must bypass RLS.
 * Use ONLY for: audit log inserts, or other minimal admin tasks documented here.
 * Never expose this client or SUPABASE_SERVICE_ROLE_KEY to the client bundle.
 */
// 클라이언트 번들 유입을 컴파일 타임에 차단 (2026-07-16 레드팀 F-13).
import 'server-only';
import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase admin env: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set'
    );
  }
  return createClient(url, serviceRoleKey);
}
