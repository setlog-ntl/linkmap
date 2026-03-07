import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, notFoundError } from '@/lib/api/errors';
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
  if (project.user_id !== user.id) return unauthorizedError();

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
    const { error } = await supabase
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
