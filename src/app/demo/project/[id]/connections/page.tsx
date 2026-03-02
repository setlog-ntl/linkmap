export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Link2 } from 'lucide-react';
import { ServiceIcon } from '@/components/ui/service-icon';
import { getServiceIconUrl } from '@/lib/constants/service-brands';

const DEMO_USER_EMAIL = 'vcdemo@linkmap.site';

export default async function DemoConnectionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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

    // user_connections: vcdemo 계정의 OAuth 연결 목록
    const { data: connections } = await admin
      .from('user_connections')
      .select('id, provider, status, connected_at, metadata')
      .eq('user_id', demoProfile.id)
      .order('connected_at', { ascending: false });

    const allConnections = connections ?? [];

    return (
      <div className="space-y-6">
        {/* 읽기 전용 안내 */}
        <div className="rounded-lg border border-brand-blue/20 bg-brand-blue/[0.05] px-4 py-3 flex items-center gap-2">
          <Eye className="h-4 w-4 text-brand-blue shrink-0" />
          <p className="text-sm text-muted-foreground">
            데모 모드에서는 연결을 추가하거나 수정할 수 없습니다.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">OAuth 연결 ({allConnections.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {allConnections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Link2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">연결된 외부 서비스가 없습니다.</p>
              </div>
            ) : (
              <div className="divide-y">
                {allConnections.map((conn) => {
                  const hasIcon = !!getServiceIconUrl(conn.provider);
                  const isActive = conn.status === 'active' || conn.status === 'connected';

                  return (
                    <div key={conn.id} className="flex items-center justify-between py-3 gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-lg border bg-muted/50 flex items-center justify-center shrink-0">
                          {hasIcon ? (
                            <ServiceIcon serviceId={conn.provider} size={18} />
                          ) : (
                            <span className="text-xs font-bold text-muted-foreground uppercase">
                              {conn.provider.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium capitalize">{conn.provider}</p>
                          {conn.connected_at && (
                            <p className="text-xs text-muted-foreground">
                              {new Date(conn.connected_at).toLocaleDateString('ko-KR')} 연결
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs shrink-0 ${
                          isActive
                            ? 'border-green-300 text-green-700 dark:text-green-400 bg-green-500/10'
                            : 'border-muted text-muted-foreground'
                        }`}
                      >
                        {isActive ? '연결됨' : conn.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  } catch {
    redirect('/demo');
  }
}
