import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, notFoundError, apiError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!project) return notFoundError('프로젝트');

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) return apiError('파일이 필요합니다', 400);
  if (!ALLOWED_TYPES.includes(file.type)) return apiError('PNG, JPG, SVG, WebP만 허용됩니다', 400);
  if (file.size > MAX_FILE_SIZE) return apiError('파일 크기는 1MB 이하여야 합니다', 400);

  const ext = file.name.split('.').pop() || 'png';
  const filePath = `${user.id}/${id}.${ext}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('project-icons')
    .upload(filePath, file, { upsert: true });

  if (uploadError) return serverError(uploadError.message);

  const { data: urlData } = supabase.storage
    .from('project-icons')
    .getPublicUrl(filePath);

  const publicUrl = urlData.publicUrl;

  // Update project
  const { data, error } = await supabase
    .from('projects')
    .update({
      icon_type: 'custom',
      icon_value: publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return serverError(error.message);

  await logAudit(user.id, {
    action: 'project.set_icon',
    resourceType: 'project',
    resourceId: id,
    details: { icon_type: 'custom' },
  });

  return NextResponse.json(data);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { data: project } = await supabase
    .from('projects')
    .select('id, icon_type, icon_value')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!project) return notFoundError('프로젝트');

  // Delete from storage if custom
  if (project.icon_type === 'custom' && project.icon_value) {
    const urlParts = project.icon_value.split('/project-icons/');
    if (urlParts[1]) {
      await supabase.storage.from('project-icons').remove([urlParts[1]]);
    }
  }

  // Reset icon
  const { data, error } = await supabase
    .from('projects')
    .update({
      icon_type: null,
      icon_value: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return serverError(error.message);

  await logAudit(user.id, {
    action: 'project.set_icon',
    resourceType: 'project',
    resourceId: id,
    details: { icon_type: null },
  });

  return NextResponse.json(data);
}
