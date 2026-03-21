import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverError } from '@/lib/api/errors';

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

  // SHA-256 해시 (Web Crypto API — Workers 호환)
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + '_showcase_view_salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const ipHash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

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

  // view_count +1
  const table = source === 'deploy' ? 'homepage_deploys' : 'projects';
  const { data: current } = await supabase
    .from(table)
    .select('view_count')
    .eq('id', id)
    .maybeSingle();

  if (current) {
    await supabase
      .from(table)
      .update({ view_count: (current.view_count ?? 0) + 1 })
      .eq('id', id);
  }

  return NextResponse.json({ recorded: true });
}
