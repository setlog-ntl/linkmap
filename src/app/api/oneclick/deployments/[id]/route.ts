import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, notFoundError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // Verify ownership
  const { data: deploy } = await supabase
    .from('homepage_deploys')
    .select('id, site_name, forked_repo_full_name, project_id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!deploy) return notFoundError('배포');

  // Delete the deploy record
  const { error } = await supabase
    .from('homepage_deploys')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Delete the linked project if it exists
  let deletedProjectId: string | null = null;
  if (deploy.project_id) {
    const { error: projectError } = await supabase
      .from('projects')
      .delete()
      .eq('id', deploy.project_id)
      .eq('user_id', user.id);

    if (!projectError) {
      deletedProjectId = deploy.project_id;
      await logAudit(user.id, {
        action: 'project.delete',
        resourceType: 'project',
        resourceId: deploy.project_id,
        details: { reason: 'cascade_from_deploy_delete', deploy_id: id },
      });
    }
  }

  await logAudit(user.id, {
    action: 'oneclick.deploy_delete',
    resourceType: 'homepage_deploy',
    resourceId: id,
    details: {
      site_name: deploy.site_name,
      repo: deploy.forked_repo_full_name,
      deleted_project_id: deletedProjectId,
    },
  });

  return NextResponse.json({ success: true, deleted_project_id: deletedProjectId });
}
