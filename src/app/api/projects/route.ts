import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createProjectSchema } from '@/lib/validations/project';
import { unauthorizedError, validationError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) return serverError(error.message);

  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { data, error } = await supabase
    .from('projects')
    .insert({ ...parsed.data, user_id: user.id })
    .select()
    .single();

  if (error) return serverError(error.message);

  await logAudit(user.id, {
    action: 'project.create',
    resourceType: 'project',
    resourceId: data.id,
    details: { name: parsed.data.name },
  });

  return NextResponse.json(data, { status: 201 });
}
