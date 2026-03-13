export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Lock } from 'lucide-react';

const DEMO_USER_EMAIL = 'vcdemo@linkmap.site';
const ENVIRONMENTS = ['development', 'staging', 'production'] as const;
type Environment = typeof ENVIRONMENTS[number];

export default async function DemoEnvPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ env?: string }>;
}) {
  const { id } = await params;
  const { env } = await searchParams;
  const activeEnv: Environment = ENVIRONMENTS.includes(env as Environment) ? (env as Environment) : 'development';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- demo page data
  let allVars: any[] = [];
  let filteredVars: typeof allVars = [];

  try {
    const admin = createAdminClient();

    const { data: demoProfile } = await admin
      .from('profiles')
      .select('id')
      .eq('email', DEMO_USER_EMAIL)
      .single();

    if (!demoProfile) redirect('/demo');

    // 소유권 검증
    const { data: project } = await admin
      .from('projects')
      .select('id')
      .eq('id', id)
      .eq('user_id', demoProfile.id)
      .is('deleted_at', null)
      .single();

    if (!project) redirect('/demo');

    // encrypted_value 제외하고 조회
    const { data: envVars } = await admin
      .from('environment_variables')
      .select('id, key_name, environment, is_secret, description, service_id')
      .eq('project_id', id)
      .order('key_name');

    allVars = envVars ?? [];
    filteredVars = allVars.filter((v) => v.environment === activeEnv);
  } catch {
    redirect('/demo');
  }

  const envCounts: Record<Environment, number> = {
    development: allVars.filter((v: { environment: string }) => v.environment === 'development').length,
    staging: allVars.filter((v: { environment: string }) => v.environment === 'staging').length,
    production: allVars.filter((v: { environment: string }) => v.environment === 'production').length,
  };

  const envLabels: Record<Environment, string> = {
    development: '개발',
    staging: '스테이징',
    production: '프로덕션',
  };

  return (
    <div className="space-y-6">
        {/* 읽기 전용 안내 */}
        <div className="rounded-lg border border-brand-blue/20 bg-brand-blue/[0.05] px-4 py-3 flex items-center gap-2">
          <Eye className="h-4 w-4 text-brand-blue shrink-0" />
          <p className="text-sm text-muted-foreground">
            데모 모드에서는 환경변수 이름만 표시됩니다. 실제 값은 로그인 후 확인할 수 있습니다.
          </p>
        </div>

        {/* 환경 탭 */}
        <div className="flex gap-2">
          {ENVIRONMENTS.map((envKey) => (
            <a
              key={envKey}
              href={`?env=${envKey}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                activeEnv === envKey
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-muted text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground'
              }`}
            >
              {envLabels[envKey]}
              <span className="ml-1.5 text-xs opacity-70">({envCounts[envKey]})</span>
            </a>
          ))}
        </div>

        {/* 변수 목록 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{envLabels[activeEnv]} 환경변수</CardTitle>
            <CardDescription>{filteredVars.length}개의 변수</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredVars.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Lock className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">{envLabels[activeEnv]} 환경에 설정된 변수가 없습니다.</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredVars.map((v) => (
                  <div key={v.id} className="flex items-center justify-between py-3 gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono font-medium truncate">{v.key_name}</p>
                      {v.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{v.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-mono text-muted-foreground">••••••••</span>
                      {v.is_secret && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Lock className="h-2.5 w-2.5" />
                          Secret
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
