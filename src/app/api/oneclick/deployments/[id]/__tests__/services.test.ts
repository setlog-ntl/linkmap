import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }));
vi.mock('@/lib/audit', () => ({ logAudit: vi.fn() }));

import { POST } from '../services/route';
import { createClient } from '@/lib/supabase/server';

const DEPLOY_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
const PROJECT_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';

function makeChain(result: { data: unknown; error: unknown }, capture?: (rows: unknown) => void) {
  const chain: Record<string, unknown> = {};
  for (const m of ['select', 'eq', 'in', 'update', 'delete', 'limit']) {
    chain[m] = vi.fn().mockReturnValue(chain);
  }
  chain.insert = vi.fn((rows: unknown) => {
    capture?.(rows);
    return Promise.resolve({ error: null });
  });
  chain.single = vi.fn().mockResolvedValue(result);
  chain.then = (resolve: (v: unknown) => void, reject: (e: unknown) => void) =>
    Promise.resolve(result).then(resolve, reject);
  return chain;
}

interface SetupOptions {
  detected?: { slug: string; label: string; foundIn: string[] }[];
  services?: { id: string; slug: string; name: string }[];
  existing?: { service_id: string }[];
  projectId?: string | null;
  /** false면 프로젝트가 본인 소유가 아닌 상황 */
  projectOwned?: boolean;
}

function setup(opts: SetupOptions = {}) {
  const inserted: unknown[] = [];
  const tables: Record<string, { data: unknown; error: unknown }> = {
    homepage_deploys: {
      data: {
        id: DEPLOY_ID,
        site_name: 'my-site',
        project_id: opts.projectId === undefined ? PROJECT_ID : opts.projectId,
        config_data: { detected_services: opts.detected ?? [{ slug: 'supabase', label: 'Supabase', foundIn: ['index.html'] }] },
      },
      error: null,
    },
    services: { data: opts.services ?? [{ id: 'svc-supabase', slug: 'supabase', name: 'Supabase' }], error: null },
    project_services: { data: opts.existing ?? [], error: null },
    // 배포 row의 user_id만으로는 부족하다 — 라우트가 프로젝트 소유권도 따로 확인한다
    projects: { data: opts.projectOwned === false ? null : { id: PROJECT_ID }, error: null },
  };

  vi.mocked(createClient).mockResolvedValue({
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
    from: vi.fn((t: string) =>
      makeChain(tables[t] ?? { data: null, error: null }, t === 'project_services' ? (r) => inserted.push(r) : undefined),
    ),
  } as never);

  return { inserted };
}

const params = { params: Promise.resolve({ id: DEPLOY_ID }) };
const request = (slugs: unknown) =>
  new NextRequest(new URL('http://localhost:3000/api/oneclick/deployments/x/services'), {
    method: 'POST',
    body: JSON.stringify({ slugs }),
  });

describe('POST /api/oneclick/deployments/[id]/services', () => {
  beforeEach(() => vi.clearAllMocks());

  it('links a detected service to the project', async () => {
    const { inserted } = setup();

    const res = await POST(request(['supabase']), params);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.added).toEqual([{ slug: 'supabase', name: 'Supabase' }]);
    expect(inserted).toEqual([[{ project_id: PROJECT_ID, service_id: 'svc-supabase' }]]);
  });

  // 감지 목록을 통과 조건으로 두지 않으면, 이 엔드포인트가 임의 서비스를
  // 프로젝트에 끼워 넣는 통로가 된다
  it('refuses a service that was never detected on this site', async () => {
    const { inserted } = setup({ detected: [{ slug: 'supabase', label: 'Supabase', foundIn: ['index.html'] }] });

    const res = await POST(request(['stripe']), params);

    expect(res.status).toBe(400);
    expect(inserted).toEqual([]);
  });

  it('does not add a service the project already has', async () => {
    const { inserted } = setup({ existing: [{ service_id: 'svc-supabase' }] });

    const res = await POST(request(['supabase']), params);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.added).toEqual([]);
    expect(body.already_linked).toEqual(['supabase']);
    expect(inserted).toEqual([]);
  });

  it('rejects an empty selection', async () => {
    setup();
    expect((await POST(request([]), params)).status).toBe(400);
  });

  // 배포 row의 project_id는 생성 이후에도 바뀔 수 있다.
  // RLS 한 겹에만 기대지 않고 앱에서도 확인해야 한다.
  it('refuses when the linked project is not owned by the caller', async () => {
    const { inserted } = setup({ projectOwned: false });

    const res = await POST(request(['supabase']), params);

    expect(res.status).toBe(404);
    expect(inserted).toEqual([]);
  });

  it('returns 400 when the deploy has no project', async () => {
    setup({ projectId: null });
    expect((await POST(request(['supabase']), params)).status).toBe(400);
  });

  it('returns 401 when signed out', async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
      from: vi.fn(),
    } as never);

    expect((await POST(request(['supabase']), params)).status).toBe(401);
  });
});
