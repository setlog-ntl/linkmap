import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('showcase_monthly_picks')
    .select('year_month')
    .order('year_month', { ascending: false });

  if (!data || data.length === 0) {
    return NextResponse.json({ months: [] });
  }

  // 월별 카운트 집계
  const monthMap = new Map<string, number>();
  for (const row of data) {
    monthMap.set(row.year_month, (monthMap.get(row.year_month) || 0) + 1);
  }

  const months = [...monthMap.entries()]
    .map(([year_month, count]) => ({ year_month, count }))
    .sort((a, b) => b.year_month.localeCompare(a.year_month));

  return NextResponse.json({ months });
}
