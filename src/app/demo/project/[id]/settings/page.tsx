export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Eye, Lock } from 'lucide-react';

const DEMO_USER_EMAIL = 'vcdemo@linkmap.site';

export default async function DemoSettingsPage({
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
      .select('id, name, description, link_url, created_at')
      .eq('id', id)
      .eq('user_id', demoProfile.id)
      .is('deleted_at', null)
      .single();

    if (!project) redirect('/demo');

    return (
      <div className="space-y-6 max-w-2xl">
        {/* 읽기 전용 안내 */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 px-4 py-3 flex items-center gap-2">
          <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400">
            데모 모드에서는 설정을 변경할 수 없습니다. 로그인하면 모든 설정을 관리할 수 있습니다.
          </p>
        </div>

        {/* 프로젝트 정보 (읽기 전용) */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>프로젝트 설정</CardTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground border rounded-md px-2 py-0.5">
                <Eye className="h-3 w-3" />
                읽기 전용
              </div>
            </div>
            <CardDescription>프로젝트 기본 정보입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>프로젝트 이름</Label>
              <Input value={project.name} readOnly disabled className="bg-muted/50 cursor-not-allowed" />
            </div>
            <div className="space-y-2">
              <Label>설명</Label>
              <Textarea
                value={project.description ?? ''}
                readOnly
                disabled
                rows={3}
                className="bg-muted/50 cursor-not-allowed resize-none"
              />
            </div>
            {project.link_url && (
              <div className="space-y-2">
                <Label>링크 URL</Label>
                <Input value={project.link_url} readOnly disabled className="bg-muted/50 cursor-not-allowed" />
              </div>
            )}
            <div className="space-y-2">
              <Label>생성일</Label>
              <Input
                value={new Date(project.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                readOnly
                disabled
                className="bg-muted/50 cursor-not-allowed"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch {
    redirect('/demo');
  }
}
