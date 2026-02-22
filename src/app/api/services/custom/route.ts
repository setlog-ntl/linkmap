import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, validationError, serverError } from '@/lib/api/errors';
import { createCustomServiceSchema } from '@/lib/validations/custom-service';
import { logAudit } from '@/lib/audit';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_custom', true)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return serverError(error.message);

  return NextResponse.json({ services: data || [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = createCustomServiceSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { name, category, description, icon_emoji, website_url, docs_url } = parsed.data;

  // slug: custom-{user_id 앞 8자}-{slugified name}
  const slug = `custom-${user.id.slice(0, 8)}-${slugify(name)}`;

  const { data, error } = await supabase
    .from('services')
    .insert({
      name,
      slug,
      category,
      description: description || null,
      description_ko: description || null,
      icon_emoji: icon_emoji || null,
      website_url: website_url || null,
      docs_url: docs_url || null,
      is_custom: true,
      user_id: user.id,
      pricing_info: {},
      required_env_vars: [],
    })
    .select('*')
    .single();

  if (error) {
    if (error.code === '23505') {
      return serverError('이미 같은 이름의 커스텀 서비스가 존재합니다');
    }
    return serverError(error.message);
  }

  await logAudit(user.id, {
    action: 'custom_service.create',
    resourceType: 'service',
    resourceId: data.id,
    details: { name, slug, category },
  });

  // 글로벌 서비스 매칭 체크 (이름 대소문자 무시)
  const { data: matchingGlobal } = await supabase
    .from('services')
    .select('id, name, slug, icon_url, category')
    .eq('is_custom', false)
    .ilike('name', name.trim());

  const response: Record<string, unknown> = { service: data };
  if (matchingGlobal && matchingGlobal.length > 0) {
    response.warning = `카탈로그에 유사한 서비스 "${matchingGlobal[0].name}"이(가) 있습니다`;
    response.matchedGlobalService = matchingGlobal[0];
  }

  return NextResponse.json(response, { status: 201 });
}
