import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, validationError, apiError, notFoundError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';

const zoneConfigSchema = z.object({
  key: z.string().max(50),
  label: z.string().max(100),
  emoji: z.string().max(10),
  color: z.string().max(100),
  subtitle: z.string().max(200).optional(),
});

const zoneConnectionSchema = z.object({
  id: z.string().max(50),
  source: z.string().max(100),
  target: z.string().max(100),
  connectionType: z.string().max(50),
  label: z.string().max(200).optional(),
});

const positionSchema = z.object({
  x: z.number().min(-10000).max(10000),
  y: z.number().min(-10000).max(10000),
});

const sizeSchema = z.object({
  width: z.number().min(50).max(5000),
  height: z.number().min(50).max(5000),
});

const zoneDataSchema = z.object({
  zoneConfigs: z.array(zoneConfigSchema).max(20).optional(),
  zoneConnections: z.array(zoneConnectionSchema).max(100).optional(),
  zonePositionOverrides: z.record(z.string(), positionSchema).optional(),
  zoneSizeOverrides: z.record(z.string(), sizeSchema).optional(),
  layoutPreset: z.enum(['horizontal', 'vertical', 'grid']).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { data, error } = await supabase
    .from('project_zone_layouts')
    .select('zone_data')
    .eq('project_id', id)
    .maybeSingle();

  if (error) return apiError(error.message, 400);
  return NextResponse.json(data?.zone_data ?? null);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = zoneDataSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  // Verify project ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!project) return notFoundError('프로젝트');

  const { data, error } = await supabase
    .from('project_zone_layouts')
    .upsert(
      {
        project_id: id,
        zone_data: parsed.data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'project_id' }
    )
    .select('zone_data')
    .single();

  if (error) return apiError(error.message, 400);

  await logAudit(user.id, {
    action: 'zone_layout.upsert',
    resourceType: 'project_zone_layout',
    resourceId: id,
    details: {
      project_id: id,
      zones: parsed.data.zoneConfigs?.length ?? 0,
      connections: parsed.data.zoneConnections?.length ?? 0,
    },
  });

  return NextResponse.json(data.zone_data);
}
