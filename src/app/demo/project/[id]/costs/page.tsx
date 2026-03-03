export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, DollarSign, FileText } from 'lucide-react';
import { ServiceIcon } from '@/components/ui/service-icon';
import { getServiceIconUrl } from '@/lib/constants/service-brands';

const DEMO_USER_EMAIL = 'vcdemo@linkmap.site';

export default async function DemoCostsPage({
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
      .select('id, monthly_budget, budget_currency')
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
        {/* Header: 읽기 전용 안내 + AI 리포트 보기 */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-brand-blue/20 bg-brand-blue/[0.05] px-4 py-2.5 flex-1">
            <Eye className="h-4 w-4 text-brand-blue shrink-0" />
            <p className="text-sm text-muted-foreground">
              데모 모드에서는 비용 정보를 볼 수만 있습니다.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 h-9 text-xs border-brand-blue/30 text-brand-blue hover:bg-brand-blue/5 shrink-0"
            asChild
          >
            <Link href={`/demo/project/${id}/costs/report`}>
              <FileText className="h-3.5 w-3.5" />
              AI 리포트 보기
            </Link>
          </Button>
        </div>

        {/* 예산 정보 */}
        {project.monthly_budget && (
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">월 예산</p>
                <p className="text-xl font-bold">
                  {Number(project.monthly_budget).toLocaleString()} {project.budget_currency}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 서비스별 비용 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">서비스별 비용</CardTitle>
          </CardHeader>
          <CardContent>
            {allServices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">연결된 서비스가 없습니다.</p>
              </div>
            ) : (
              <div className="divide-y">
                {allServices.map((ps) => {
                  const hasIcon = ps.service?.slug ? !!getServiceIconUrl(ps.service.slug) : false;
                  const monthlyCost = ps.custom_cost_monthly
                    ? `${Number(ps.custom_cost_monthly).toLocaleString()} ${ps.cost_notes ? '(' + ps.cost_notes + ')' : ''}`
                    : null;

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
                          {ps.billing_cycle && (
                            <p className="text-xs text-muted-foreground capitalize">
                              {ps.billing_cycle === 'monthly' ? '월정액' : ps.billing_cycle === 'yearly' ? '연정액' : '사용량 기반'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        {monthlyCost ? (
                          <p className="text-sm font-medium">{monthlyCost}</p>
                        ) : (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            미등록
                          </Badge>
                        )}
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
  } catch {
    redirect('/demo');
  }
}
