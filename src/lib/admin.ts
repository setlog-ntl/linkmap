import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Check if a user is an admin by querying profiles.is_admin using the admin client.
 * Uses service_role to bypass RLS — prevents users from manipulating their own is_admin field.
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();

    return data?.is_admin === true;
  } catch {
    return false;
  }
}
