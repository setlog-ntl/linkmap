import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError } from '@/lib/api/errors';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const search = request.nextUrl.searchParams.get('search');
  const serviceId = request.nextUrl.searchParams.get('service_id');

  let query = supabase
    .from('mcp_servers')
    .select('*')
    .order('popularity_score', { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%,description.ilike.%${search}%,description_ko.ilike.%${search}%`);
  }

  if (serviceId) {
    query = query.contains('related_service_ids', [serviceId]);
  }

  const { data, error } = await query;

  if (error) return apiError(error.message, 400);
  return NextResponse.json(data);
}
