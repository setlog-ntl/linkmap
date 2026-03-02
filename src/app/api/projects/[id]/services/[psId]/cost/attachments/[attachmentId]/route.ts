import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  unauthorizedError,
  notFoundError,
  serverError,
} from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';

type Params = { params: Promise<{ id: string; psId: string; attachmentId: string }> };

// ── DELETE: 첨부 파일 삭제 ────────────────────────────────────────────────
export async function DELETE(request: NextRequest, { params }: Params) {
  const { id, psId, attachmentId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 소유권 확인 (프로젝트)
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .single();
  if (!project) return notFoundError('프로젝트');

  // 첨부 파일 조회
  const { data: attachment } = await supabase
    .from('cost_attachments')
    .select('id, storage_path, project_service_id, file_name')
    .eq('id', attachmentId)
    .eq('project_service_id', psId)
    .single();

  if (!attachment) return notFoundError('첨부 파일');

  // Storage에서 파일 삭제
  const { error: storageError } = await supabase.storage
    .from('cost-receipts')
    .remove([attachment.storage_path]);

  if (storageError) {
    return serverError(`Storage 파일 삭제 실패: ${storageError.message}`);
  }

  // DB 레코드 삭제
  const { error: dbError } = await supabase
    .from('cost_attachments')
    .delete()
    .eq('id', attachmentId);

  if (dbError) return serverError(dbError.message);

  await logAudit(user.id, {
    action: 'cost_attachment.delete',
    resourceType: 'cost_attachment',
    resourceId: attachmentId,
    details: {
      project_id: id,
      project_service_id: psId,
      file_name: attachment.file_name,
    },
  });

  return new NextResponse(null, { status: 204 });
}
