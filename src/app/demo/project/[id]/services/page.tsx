export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Layers } from 'lucide-react';
import { ServiceIcon } from '@/components/ui/service-icon';
import { getServiceIconUrl } from '@/lib/constants/service-brands';

const DEMO_USER_EMAIL = 'vcdemo@linkmap.site';

const STATUS_CONFIG = {
  connected: { label: '연결됨', className: 'border-green-300 text-green-700 dark:text-green-400 bg-green-500/10' },
  error: { label: '오류', className: 'border-red-300 text-red-700 dark:text-red-400 bg-red-500/10' },
  in_progress: { label: '설정 중', className: 'border-yellow-300 text-yellow-700 dark:text-yellow-400 bg-yellow-500/10' },
  not_started: { label: '미시작', className: 'border-muted text-muted-foreground' },
  disconnected: { label: '연결 해제', className: 'border-muted text-muted-foreground' },
} as const;

export default async function DemoServicesPage({
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

    const { data: services } = await admin
      .from('project_services')
      .select('*, service:services(*)')
      .eq('project_id', id)
      .order('created_at');

    const allServices = services ?? [];

    return (
      <div className="space-y-6">
        {/* 읽기 전용 안내 */}
        <div className="rounded-lg border border-brand-blue/20 bg-brand-blue/[0.05] px-4 py-3 flex items-center gap-2">
          <Eye className="h-4 w-4 text-brand-blue shrink-0" />
          <p className="text-sm text-muted-foreground">
            데모 모드에서는 서비스를 추가하거나 수정할 수 없습니다.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">연결된 서비스 ({allServices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {allServices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Layers className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">연결된 서비스가 없습니다.</p>
              </div>
            ) : (
              <div className="divide-y">
                {allServices.map((ps) => {
                  const statusConfig = STATUS_CONFIG[ps.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.not_started;
                  const hasIcon = ps.service?.slug ? !!getServiceIconUrl(ps.service.slug) : false;

                  return (
                    <div key={ps.id} className="flex items-center justify-between py-3 gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-lg border bg-muted/50 flex items-center justify-center shrink-0">
                          {hasIcon ? (
                            <ServiceIcon serviceId={ps.service!.slug} size={18} />
                          ) : (
                            <span className="text-xs font-bold text-muted-foreground">
                              {ps.service?.name?.charAt(0) ?? '?'}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{ps.service?.name ?? '알 수 없는 서비스'}</p>
                          {ps.service?.category && (
                            <p className="text-xs text-muted-foreground capitalize">{ps.service.category}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-xs shrink-0 ${statusConfig.className}`}>
                        {statusConfig.label}
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
