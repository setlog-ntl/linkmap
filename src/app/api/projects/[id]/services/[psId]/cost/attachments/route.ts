import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAttachmentMetaSchema, addLinkSchema, ALLOWED_ATTACHMENT_MIME_TYPES, MAX_ATTACHMENT_SIZE } from '@/lib/validations/cost';
import {
  unauthorizedError,
  notFoundError,
  validationError,
  serverError,
} from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import type { CostAttachment } from '@/types';

type Params = { params: Promise<{ id: string; psId: string }> };

/** 소유권 확인 헬퍼 */
async function verifyOwnership(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  projectId: string,
  psId: string
) {
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .single();
  if (!project) return null;

  const { data: ps } = await supabase
    .from('project_services')
    .select('id')
    .eq('id', psId)
    .eq('project_id', projectId)
    .single();
  return ps;
}

// ── GET: 첨부 파일 목록 조회 ────────────────────────────────────────────────
export async function GET(request: NextRequest, { params }: Params) {
  const { id, psId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const ps = await verifyOwnership(supabase, user.id, id, psId);
  if (!ps) return notFoundError('프로젝트 서비스');

  const { data: rows, error } = await supabase
    .from('cost_attachments')
    .select('*')
    .eq('project_service_id', psId)
    .order('created_at', { ascending: false });

  if (error) return serverError(error.message);

  // 각 파일에 서명된 URL 생성 (60분 유효, 파일 첨부만)
  const attachments: CostAttachment[] = await Promise.all(
    (rows ?? []).map(async (row) => {
      let signedUrl: string | undefined;
      if (row.storage_path) {
        const { data: signed } = await supabase.storage
          .from('cost-receipts')
          .createSignedUrl(row.storage_path, 3600);
        signedUrl = signed?.signedUrl ?? undefined;
      }

      return {
        id: row.id,
        projectServiceId: row.project_service_id,
        fileName: row.file_name,
        storagePath: row.storage_path ?? null,
        fileSize: row.file_size ?? null,
        fileType: row.file_type ?? null,
        attachmentType: row.attachment_type,
        notes: row.notes,
        uploadedBy: row.uploaded_by,
        createdAt: row.created_at,
        linkUrl: row.link_url ?? null,
        linkTitle: row.link_title ?? null,
        signedUrl,
      };
    })
  );

  return NextResponse.json(attachments);
}

// ── POST: 파일 업로드 또는 링크 저장 ─────────────────────────────────────
export async function POST(request: NextRequest, { params }: Params) {
  const { id, psId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const ps = await verifyOwnership(supabase, user.id, id, psId);
  if (!ps) return notFoundError('프로젝트 서비스');

  const contentType = request.headers.get('content-type') ?? '';

  // ── JSON 요청 → 링크 저장 ────────────────────────────────────────────
  if (contentType.includes('application/json')) {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return validationError({ issues: [{ message: '요청 본문을 읽을 수 없습니다' }] } as never);
    }

    const parsed = addLinkSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const { link_url, link_title, attachment_type, notes } = parsed.data;

    // file_name: 제목 우선, 없으면 URL 호스트명
    let fileName = link_title ?? '';
    if (!fileName) {
      try {
        fileName = new URL(link_url).hostname;
      } catch {
        fileName = link_url.slice(0, 100);
      }
    }

    const { data: attachment, error: dbError } = await supabase
      .from('cost_attachments')
      .insert({
        project_service_id: psId,
        file_name: fileName,
        storage_path: null,
        file_size: null,
        file_type: null,
        attachment_type,
        notes: notes ?? null,
        uploaded_by: user.id,
        link_url,
        link_title: link_title ?? null,
      })
      .select()
      .single();

    if (dbError) return serverError(dbError.message);

    await logAudit(user.id, {
      action: 'cost_attachment.link_add',
      resourceType: 'cost_attachment',
      resourceId: attachment.id,
      details: {
        project_id: id,
        project_service_id: psId,
        link_url,
        attachment_type,
      },
    });

    const result: CostAttachment = {
      id: attachment.id,
      projectServiceId: attachment.project_service_id,
      fileName: attachment.file_name,
      storagePath: null,
      fileSize: null,
      fileType: null,
      attachmentType: attachment.attachment_type,
      notes: attachment.notes,
      uploadedBy: attachment.uploaded_by,
      createdAt: attachment.created_at,
      linkUrl: attachment.link_url ?? null,
      linkTitle: attachment.link_title ?? null,
    };

    return NextResponse.json(result, { status: 201 });
  }

  // ── FormData 요청 → 파일 업로드 ──────────────────────────────────────
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return validationError({ issues: [{ message: '파일 데이터를 읽을 수 없습니다' }] } as never);
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'file 필드가 없거나 유효하지 않습니다' }, { status: 400 });
  }

  // 파일 크기 검사
  if (file.size > MAX_ATTACHMENT_SIZE) {
    return NextResponse.json({ error: '파일 크기는 10MB를 초과할 수 없습니다' }, { status: 400 });
  }

  // MIME 타입 검사
  const allowedTypes: readonly string[] = ALLOWED_ATTACHMENT_MIME_TYPES;
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: '지원하지 않는 파일 형식입니다. PDF, 이미지, CSV, Excel만 허용됩니다' },
      { status: 400 }
    );
  }

  // 메타데이터 필드 검증
  const metaRaw = {
    attachment_type: formData.get('attachment_type') ?? 'other',
    notes: formData.get('notes') ?? null,
  };
  const parsed = createAttachmentMetaSchema.safeParse(metaRaw);
  if (!parsed.success) return validationError(parsed.error);

  // Storage 경로: {userId}/{psId}/{timestamp}_{originalName}
  const safeFileName = file.name.replace(/[^a-zA-Z0-9._\-가-힣]/g, '_');
  const storagePath = `${user.id}/${psId}/${Date.now()}_${safeFileName}`;

  // Storage에 업로드
  const fileBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from('cost-receipts')
    .upload(storagePath, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return serverError(`파일 업로드 실패: ${uploadError.message}`);
  }

  // DB에 메타데이터 저장
  const { data: attachment, error: dbError } = await supabase
    .from('cost_attachments')
    .insert({
      project_service_id: psId,
      file_name: file.name,
      storage_path: storagePath,
      file_size: file.size,
      file_type: file.type,
      attachment_type: parsed.data.attachment_type,
      notes: parsed.data.notes ?? null,
      uploaded_by: user.id,
    })
    .select()
    .single();

  if (dbError) {
    // DB 저장 실패 시 Storage 파일 롤백
    await supabase.storage.from('cost-receipts').remove([storagePath]);
    return serverError(dbError.message);
  }

  await logAudit(user.id, {
    action: 'cost_attachment.upload',
    resourceType: 'cost_attachment',
    resourceId: attachment.id,
    details: {
      project_id: id,
      project_service_id: psId,
      file_name: file.name,
      file_size: file.size,
      attachment_type: parsed.data.attachment_type,
    },
  });

  // 서명 URL 생성
  const { data: signed } = await supabase.storage
    .from('cost-receipts')
    .createSignedUrl(storagePath, 3600);

  const result: CostAttachment = {
    id: attachment.id,
    projectServiceId: attachment.project_service_id,
    fileName: attachment.file_name,
    storagePath: attachment.storage_path ?? null,
    fileSize: attachment.file_size ?? null,
    fileType: attachment.file_type ?? null,
    attachmentType: attachment.attachment_type,
    notes: attachment.notes,
    uploadedBy: attachment.uploaded_by,
    createdAt: attachment.created_at,
    signedUrl: signed?.signedUrl ?? undefined,
  };

  return NextResponse.json(result, { status: 201 });
}
