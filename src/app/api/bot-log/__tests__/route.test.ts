import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

import { POST } from '../route';

function createRequest(body: unknown) {
  return new NextRequest(new URL('/api/bot-log', 'http://localhost:3000'), {
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('POST /api/bot-log', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role-key');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 201 }));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('returns 400 for invalid JSON', async () => {
    const res = await POST(createRequest('not valid json {{{'));

    expect(res.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await POST(createRequest({ path: '/blog' }));

    expect(res.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  // 무인증 service_role 쓰기 경로이므로 길이 상한이 없으면 대용량 행을 무제한
  // 삽입해 테이블·비용을 팽창시킬 수 있다 (2026-07-16 레드팀 F-9).
  it('rejects an over-long path before writing', async () => {
    const res = await POST(
      createRequest({ path: '/' + 'a'.repeat(2048), userAgent: 'GPTBot/1.0' }),
    );

    expect(res.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects an over-long userAgent before writing', async () => {
    const res = await POST(
      createRequest({ path: '/blog', userAgent: 'GPTBot ' + 'a'.repeat(1024) }),
    );

    expect(res.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects an over-long ip before writing', async () => {
    const res = await POST(
      createRequest({ path: '/blog', userAgent: 'GPTBot/1.0', ip: 'x'.repeat(65) }),
    );

    expect(res.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects non-string field types', async () => {
    const res = await POST(createRequest({ path: 123, userAgent: 'GPTBot/1.0' }));

    expect(res.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('does not write when the user agent is not a known AI bot', async () => {
    const res = await POST(
      createRequest({ path: '/blog', userAgent: 'Mozilla/5.0 (regular browser)' }),
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.reason).toBe('not a bot');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('writes the log for a recognised AI bot', async () => {
    const res = await POST(createRequest({ path: '/blog', userAgent: 'GPTBot/1.0', ip: '1.2.3.4' }));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(1);

    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect(JSON.parse(String(init?.body))).toEqual({
      bot_name: 'GPTBot',
      path: '/blog',
      user_agent: 'GPTBot/1.0',
      ip_address: '1.2.3.4',
    });
  });

  it('returns 500 when supabase credentials are not configured', async () => {
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '');

    const res = await POST(createRequest({ path: '/blog', userAgent: 'GPTBot/1.0' }));

    expect(res.status).toBe(500);
  });
});
