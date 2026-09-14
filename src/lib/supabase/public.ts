/**
 * 쿠키를 읽지 않는 anon Supabase 클라이언트 — ISR/정적 렌더 전용 읽기.
 *
 * server.ts의 createClient()는 cookies()를 호출하므로 페이지를 동적 렌더링으로 바꾼다.
 * `revalidate = N`으로 캐시되는 공개 페이지(sitemap·llms.txt·/resources)가 DB를 읽을 때는
 * 이 클라이언트를 쓴다. RLS의 anon SELECT 정책이 허용한 행만 보이며, 쓰기에 사용하지 않는다.
 */
import 'server-only';
import { createClient } from '@supabase/supabase-js';

export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set'
    );
  }
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
