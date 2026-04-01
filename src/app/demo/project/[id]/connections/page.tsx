export const revalidate = false;

import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Link2, ArrowRight } from 'lucide-react';

const DEMO_USER_EMAIL = 'vcdemo@linkmap.site';

const CONNECTION_TYPE_LABELS: Record<string, string> = {
  uses: '사용',
  integrates: '통합',
  data_transfer: '데이터 전송',
  api_call: 'API 호출',
  auth_provider: '인증',
  webhook: '웹훅',
  sdk: 'SDK',
};

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  active: { label: '활성', className: 'border-green-300 text-green-700 dark:text-green-400 bg-green-500/10' },
  inactive: { label: '비활성', className: 'border-muted text-muted-foreground' },
  error: { label: '오류', className: 'border-red-300 text-red-700 dark:text-red-400 bg-red-500/10' },
  pending: { label: '대기', className: 'border-yellow-300 text-yellow-700 dark:text-yellow-400 bg-yellow-500/10' },
};

export default async function DemoConnectionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- demo page data
  let allConnections: any[] = [];

  try {
    const admin = createAdminClient();

    const { data: demoProfile } = await admin
      .from('profiles')
      .select('id')
      .eq('email', DEMO_USER_EMAIL)
      .single();

    if (!demoProfile) redirect('/demo');

    const { data: project } = await admin
      .from('projects')
      .select('id')
      .eq('id', id)
      .eq('user_id', demoProfile.id)
      .is('deleted_at', null)
      .single();

    if (!project) redirect('/demo');

    const { data: connections } = await admin
      .from('user_connections')
      .select(`
        id, connection_type, connection_status, environment, label, description,
        source:services!user_connections_source_service_id_fkey(id, name, slug),
        target:services!user_connections_target_service_id_fkey(id, name, slug)
      `)
      .eq('project_id', id)
      .order('created_at');

    allConnections = connections ?? [];
  } catch {
    redirect('/demo');
  }

  return (
    <div className="space-y-6">
      {/* 읽기 전용 안내 */}
      <div className="rounded-lg border border-brand-blue/20 bg-brand-blue/[0.05] px-4 py-3 flex items-center gap-2">
        <Eye className="h-4 w-4 text-brand-blue shrink-0" />
        <p className="text-sm text-muted-foreground">
          데모 모드에서는 서비스 연결을 추가하거나 수정할 수 없습니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">서비스 연결 ({allConnections.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {allConnections.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Link2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">정의된 서비스 연결이 없습니다.</p>
            </div>
          ) : (
            <div className="divide-y">
              {allConnections.map((conn) => {
                const statusConfig = STATUS_CONFIG[conn.connection_status ?? 'active'] ?? STATUS_CONFIG.active;
                const typeLabel = CONNECTION_TYPE_LABELS[conn.connection_type] ?? conn.connection_type;
                const source = conn.source as { name?: string } | null;
                const target = conn.target as { name?: string } | null;

                return (
                  <div key={conn.id} className="flex items-center justify-between py-3 gap-4">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-sm font-medium truncate">{source?.name ?? '?'}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-sm font-medium truncate">{target?.name ?? '?'}</span>
                      {conn.label && (
                        <span className="text-xs text-muted-foreground truncate">({conn.label})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className="text-xs">
                        {typeLabel}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${statusConfig.className}`}>
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
