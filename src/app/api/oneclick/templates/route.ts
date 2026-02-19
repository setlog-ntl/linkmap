import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverError } from '@/lib/api/errors';
import { getAvailableSlugs } from '@/data/homepage-template-content';

export async function GET(request: NextRequest) {
  const supabase = await createClient();

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

  // Filter out DB entries that have no code bundle available
  const availableSlugs = getAvailableSlugs();
  const validTemplates = (templates ?? []).filter(
    (t: { slug: string }) => availableSlugs.has(t.slug)
  );

  return NextResponse.json({ templates: validTemplates });
}
