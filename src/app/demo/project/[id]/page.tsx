export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers, Zap, AlertCircle, Clock, DollarSign, Eye } from 'lucide-react';

const DEMO_USER_EMAIL = 'vcdemo@linkmap.site';

export default async function DemoProjectPage({
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

    const [projectResult, servicesResult, envResult] = await Promise.all([
      admin
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', demoProfile.id)
        .is('deleted_at', null)
        .single(),
      admin
        .from('project_services')
        .select('*, service:services(*)')
        .eq('project_id', id),
      admin
        .from('environment_variables')
        .select('id, key_name, environment, is_secret')
        .eq('project_id', id),
    ]);

    if (!projectResult.data) redirect('/demo');

    const project = projectResult.data;
    const services = servicesResult.data ?? [];
    const envVars = envResult.data ?? [];

    const connectedCount = services.filter((s) => s.status === 'connected').length;
    const errorCount = services.filter((s) => s.status === 'error').length;
    const secretCount = envVars.filter((v) => v.is_secret).length;

    return (
      <div className="space-y-6">
        {/* 읽기 전용 안내 */}
        <div className="rounded-lg border border-brand-blue/20 bg-brand-blue/[0.05] px-4 py-3 flex items-center gap-2">
          <Eye className="h-4 w-4 text-brand-blue shrink-0" />
          <p className="text-sm text-muted-foreground">
            데모 모드에서는 데이터를 볼 수만 있습니다. AI 어시스턴트 및 수정 기능을 사용하려면 로그인하세요.
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Layers className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{services.length}</p>
                <p className="text-xs text-muted-foreground">전체 서비스</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-2">
                <Zap className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{connectedCount}</p>
                <p className="text-xs text-muted-foreground">연결됨</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-lg bg-red-500/10 p-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{errorCount}</p>
                <p className="text-xs text-muted-foreground">오류</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-lg bg-yellow-500/10 p-2">
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{secretCount}</p>
                <p className="text-xs text-muted-foreground">시크릿 키</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 서비스 목록 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">연결된 서비스</CardTitle>
          </CardHeader>
          <CardContent>
            {services.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">연결된 서비스가 없습니다.</p>
            ) : (
              <div className="divide-y">
                {services.map((ps) => (
                  <div key={ps.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium">{ps.service?.name ?? '알 수 없는 서비스'}</p>
                      {ps.notes && (
                        <p className="text-xs text-muted-foreground">{ps.notes}</p>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        ps.status === 'connected'
                          ? 'border-green-300 text-green-700 dark:text-green-400 bg-green-500/10'
                          : ps.status === 'error'
                            ? 'border-red-300 text-red-700 dark:text-red-400 bg-red-500/10'
                            : 'border-muted text-muted-foreground'
                      }
                    >
                      {ps.status === 'connected' ? '연결됨' : ps.status === 'error' ? '오류' : ps.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 프로젝트 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">프로젝트 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">마지막 수정:</span>
              <span>{new Date(project.updated_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">환경변수:</span>
              <span>{envVars.length}개</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch {
    redirect('/demo');
  }
}
