import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Check if a user is an admin by querying profiles.is_admin.
 */
export async function isAdmin(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single();

  return data?.is_admin === true;
}
