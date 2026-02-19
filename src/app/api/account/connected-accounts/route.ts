import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, serverError } from '@/lib/api/errors';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { data, error } = await supabase
    .from('service_accounts')
    .select(`
      id, connection_type, oauth_metadata, oauth_scopes,
      oauth_provider_user_id, status, last_verified_at,
      error_message, created_at, project_id,
      service:service_id(name, slug, icon_url, category),
      project:project_id(name)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return serverError(error.message);
  }

  return NextResponse.json({ accounts: data });
}
