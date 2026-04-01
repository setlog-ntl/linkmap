export const revalidate = false;

import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { DemoCostReportView } from '@/components/demo/demo-cost-report-view';
import { DEMO_COST_REPORT, DEMO_COST_REPORT_GENERATED_AT } from '@/data/demo/demo-cost-report';

const DEMO_USER_EMAIL = 'vcdemo@linkmap.site';

export default async function DemoCostReportPage({
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
  } catch {
    redirect('/demo');
  }

  return (
    <DemoCostReportView
      projectId={id}
      initialReport={{ report: DEMO_COST_REPORT, generatedAt: DEMO_COST_REPORT_GENERATED_AT }}
      backHref={`/demo/project/${id}/costs`}
    />
  );
}
