import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverError } from '@/lib/api/errors';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Rate limit: use user ID if authenticated, IP otherwise
  const rateLimitKey = user
    ? `oneclick-templates:${user.id}`
    : `oneclick-templates:${request.headers.get('x-forwarded-for') || 'anon'}`;

  const { success } = rateLimit(rateLimitKey, 30);
  if (!success) return NextResponse.json({ error: '요청이 너무 많습니다.' }, { status: 429 });

  const deployTarget = request.nextUrl.searchParams.get('deploy_target') || 'github_pages';

  let query = supabase
    .from('homepage_templates')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  // Filter by deploy_target if specified
  if (deployTarget !== 'all') {
    query = query.or(`deploy_target.eq.${deployTarget},deploy_target.eq.both`);
  }

  const { data: templates, error } = await query;

  if (error) return serverError(error.message);

  return NextResponse.json({ templates });
}
