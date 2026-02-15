import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdmin } from '@/lib/admin';
import { unauthorizedError, apiError, serverError } from '@/lib/api/errors';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || 'today';

  let startDate: string;
  const now = new Date();
  switch (period) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      break;
    default: // 'today'
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      break;
  }

  const adminSupabase = createAdminClient();

  // Fetch logs
  const { data: logs, error } = await adminSupabase
    .from('ai_usage_logs')
    .select('*')
    .gte('created_at', startDate)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Usage logs fetch error:', error);
    return serverError('사용량 조회에 실패했습니다');
  }

  const allLogs = logs || [];

  // Compute summary
  const totalRequests = allLogs.length;
  const totalTokens = allLogs.reduce((sum, l) => sum + (l.total_tokens || 0), 0);
  const responseTimes = allLogs.filter((l) => l.response_time_ms != null).map((l) => l.response_time_ms as number);
  const avgResponseTime = responseTimes.length > 0
    ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
    : 0;
  const errorCount = allLogs.filter((l) => l.status !== 'success').length;
  const errorRate = totalRequests > 0 ? Number((errorCount / totalRequests * 100).toFixed(1)) : 0;

  return NextResponse.json({
    summary: {
      total_requests: totalRequests,
      total_tokens: totalTokens,
      avg_response_time: avgResponseTime,
      error_rate: errorRate,
    },
    logs: allLogs,
  });
}
