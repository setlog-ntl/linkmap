import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, notFoundError, apiError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { deleteRepo } from '@/lib/github/api';
import { safeDecryptToken } from '@/lib/github/token';
import { z } from 'zod';

const patchSchema = z.object({
  site_name: z.string().min(1, '사이트 이름은 필수입니다').max(100, '사이트 이름은 100자 이내여야 합니다'),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    const messages = parsed.error.issues.map((e) => e.message).join(', ');
    return apiError(messages, 400);
  }

  const { site_name } = parsed.data;

  // Verify ownership
  const { data: deploy } = await supabase
    .from('homepage_deploys')
    .select('id, site_name')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!deploy) return notFoundError('배포');

  const { error } = await supabase
    .from('homepage_deploys')
    .update({ site_name })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logAudit(user.id, {
    action: 'oneclick.deploy_rename',
    resourceType: 'homepage_deploy',
    resourceId: id,
    details: { old_name: deploy.site_name, new_name: site_name },
  });

  return NextResponse.json({ success: true, site_name });
}

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

  // Best-effort: GitHub 저장소 삭제 (삭제 후 동일 이름 재배포 가능하도록)
  let githubRepoDeletion: 'deleted' | 'skipped' | 'failed' = 'skipped';
  if (deploy.forked_repo_full_name && deploy.project_id) {
    try {
      const { data: repoRecord } = await supabase
        .from('project_github_repos')
        .select('service_account_id')
        .eq('project_id', deploy.project_id)
        .single();

      if (repoRecord?.service_account_id) {
        const { data: serviceAccount } = await supabase
          .from('service_accounts')
          .select('encrypted_access_token')
          .eq('id', repoRecord.service_account_id)
          .single();

        if (serviceAccount?.encrypted_access_token) {
          const decryptResult = await safeDecryptToken(
            serviceAccount.encrypted_access_token,
            supabase,
            repoRecord.service_account_id,
          );
          if (!('error' in decryptResult)) {
            const slashIdx = deploy.forked_repo_full_name.indexOf('/');
            const owner = deploy.forked_repo_full_name.slice(0, slashIdx);
            const repoName = deploy.forked_repo_full_name.slice(slashIdx + 1);
            await deleteRepo(decryptResult.token, owner, repoName);
            githubRepoDeletion = 'deleted';
          }
        }
      }
    } catch {
      // best-effort: GitHub 저장소 삭제 실패해도 Linkmap 기록은 정상 삭제
      githubRepoDeletion = 'failed';
    }
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
      github_repo_deletion: githubRepoDeletion,
    },
  });

  return NextResponse.json({ success: true, deleted_project_id: deletedProjectId });
}
