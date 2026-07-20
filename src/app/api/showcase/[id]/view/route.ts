import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverError } from '@/lib/api/errors';
import { hashIp, SHOWCASE_VIEW_IP_SALT } from '@/lib/utils/hash-ip';

// POST: 조회수 기록
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // IP 해시 생성 (비로그인 사용자용)
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';

  // SHA-256 해시 (Web Crypto API — Workers 호환). 솔트는 기존 값 유지 — 이미 저장된
  // viewer_ip_hash와 대조가 깨지지 않아야 30분 중복 조회 판별이 유지된다.
  const ipHash = await hashIp(ip, SHOWCASE_VIEW_IP_SALT);

  // showcase_source 결정: deploy 또는 project
  const { data: deployCheck } = await supabase
    .from('homepage_deploys')
    .select('id')
    .eq('id', id)
    .eq('is_showcase', true)
    .maybeSingle();

  const source = deployCheck ? 'deploy' : 'project';

  // 30분 내 중복 체크
  const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

  if (user) {
    // 로그인 사용자: viewer_id 기준
    const { data: recentView } = await supabase
      .from('showcase_views')
      .select('id')
      .eq('showcase_id', id)
      .eq('viewer_id', user.id)
      .gte('created_at', thirtyMinAgo)
      .limit(1)
      .maybeSingle();

    if (recentView) {
      return NextResponse.json({ recorded: false, reason: 'duplicate' });
    }

    const { error } = await supabase
      .from('showcase_views')
      .insert({
        showcase_id: id,
        showcase_source: source,
        viewer_id: user.id,
        viewer_ip_hash: ipHash,
      });

    if (error) return serverError('조회 기록 실패');
  } else {
    // 비로그인 사용자: IP 해시 기준
    const { data: recentView } = await supabase
      .from('showcase_views')
      .select('id')
      .eq('showcase_id', id)
      .eq('viewer_ip_hash', ipHash)
      .gte('created_at', thirtyMinAgo)
      .limit(1)
      .maybeSingle();

    if (recentView) {
      return NextResponse.json({ recorded: false, reason: 'duplicate' });
    }

    const { error } = await supabase
      .from('showcase_views')
      .insert({
        showcase_id: id,
        showcase_source: source,
        viewer_ip_hash: ipHash,
      });

    if (error) return serverError('조회 기록 실패');
  }

  // view_count +1 (RPC로 RLS 우회)
  const table = source === 'deploy' ? 'homepage_deploys' : 'projects';
  await supabase.rpc('increment_showcase_counter', {
    p_table: table,
    p_id: id,
    p_column: 'view_count',
    p_delta: 1,
  });

  return NextResponse.json({ recorded: true });
}
