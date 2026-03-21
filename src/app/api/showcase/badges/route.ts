import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ badges: [] });
  }

  const { data } = await supabase
    .from('showcase_badges')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return NextResponse.json({ badges: data || [] });
}
