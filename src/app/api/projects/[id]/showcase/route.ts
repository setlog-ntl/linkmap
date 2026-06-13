import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { unauthorizedError, notFoundError } from '@/lib/api/errors';
import { isAdmin } from '@/lib/admin';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';

const showcaseSchema = z.object({
  action: z.enum(['register', 'unregister', 'update']),
  description: z.string().max(500).optional(),
  tags: z.array(z.string().max(30)).max(5).optional(),
  category: z.enum(['portfolio', 'business', 'blog', 'landing', 'community', 'ecommerce', 'other']).optional(),
  image_url: z.string().url().max(2000).nullable().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await req.json().catch(() => ({}));
  const parsed = showcaseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || '잘못된 요청' }, { status: 400 });
  }

  const { action, description, tags, category, image_url } = parsed.data;

  // 소유권 확인
  const { data: project } = await supabase
    .from('projects')
    .select('id, user_id, is_showcase, link_url')
    .eq('id', id)
    .single();

  if (!project) return notFoundError('프로젝트');

  // 권한: 소유자는 모든 액션 가능. 관리자는 모더레이션(unregister)만 가능 — 타인 콘텐츠 등록/수정 불가.
  const isOwner = project.user_id === user.id;
  let actingAsAdmin = false;
  if (!isOwner) {
    actingAsAdmin = await isAdmin(user.id);
    if (!actingAsAdmin || action !== 'unregister') return unauthorizedError();
  }

  if (action === 'register') {
    const { error } = await supabase
      .from('projects')
      .update({
        is_showcase: true,
        showcase_description: description || null,
        showcase_tags: tags || [],
        showcase_category: category || null,
        showcase_image_url: image_url ?? null,
      })
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ is_showcase: true });
  }

  if (action === 'unregister') {
    // 관리자가 타인 행을 내릴 때는 RLS(update own projects: user_id=auth.uid())를 우회해야 하므로 admin client 사용.
    const writeClient = actingAsAdmin ? createAdminClient() : supabase;
    const { error } = await writeClient
      .from('projects')
      .update({
        is_showcase: false,
        showcase_description: null,
        showcase_tags: [],
        showcase_category: null,
        showcase_image_url: null,
      })
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // 관리자가 타인의 쇼케이스를 내린 경우 모더레이션 감사 로그
    if (actingAsAdmin) {
      await logAudit(user.id, {
        action: 'showcase.admin_remove',
        resourceType: 'project',
        resourceId: id,
        details: { owner_id: project.user_id, source: 'project' },
      });
    }

    return NextResponse.json({ is_showcase: false });
  }

  if (action === 'update') {
    if (!project.is_showcase) {
      return NextResponse.json({ error: '쇼케이스에 등록된 프로젝트만 수정할 수 있습니다' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (description !== undefined) updateData.showcase_description = description || null;
    if (tags !== undefined) updateData.showcase_tags = tags;
    if (category !== undefined) updateData.showcase_category = category || null;
    if (image_url !== undefined) updateData.showcase_image_url = image_url;

    const { error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: '잘못된 액션' }, { status: 400 });
}
