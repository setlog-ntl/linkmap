import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/env', () => ({
  getRuntimeEnv: vi.fn(),
}));
vi.mock('@/lib/audit', () => ({
  logAudit: vi.fn(),
}));
vi.mock('@/lib/email/sender', () => ({
  sendEmail: vi.fn().mockResolvedValue(true),
}));

import { POST } from '../route';
import { getRuntimeEnv } from '@/lib/env';
import { logAudit } from '@/lib/audit';
import { sendEmail } from '@/lib/email/sender';

const SECRET = 'webhook-secret-value';

const signupPayload = {
  type: 'INSERT',
  table: 'users',
  record: {
    id: 'user-1',
    email: 'new@example.com',
    raw_user_meta_data: { full_name: 'New User' },
  },
};

function createRequest(body: unknown, authHeader?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authHeader !== undefined) headers.authorization = authHeader;
  return new NextRequest(new URL('/api/auth/webhook', 'http://localhost:3000'), {
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
    headers,
  });
}

describe('POST /api/auth/webhook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(sendEmail).mockResolvedValue(true);
  });

  // 시크릿 미설정 시 검증을 건너뛰고 처리를 계속하면(fail-open) 누구나 임의의
  // welcome 메일을 발송시키고 감사 로그를 위조할 수 있다 (2026-07-16 레드팀 F-10).
  it('returns 503 fail-closed when the webhook secret is not configured', async () => {
    vi.mocked(getRuntimeEnv).mockReturnValue(undefined);

    const res = await POST(createRequest(signupPayload));

    expect(res.status).toBe(503);
    expect(sendEmail).not.toHaveBeenCalled();
    expect(logAudit).not.toHaveBeenCalled();
  });

  it('returns 503 without verification even when a valid-looking token is supplied', async () => {
    vi.mocked(getRuntimeEnv).mockReturnValue('');

    const res = await POST(createRequest(signupPayload, `Bearer ${SECRET}`));

    expect(res.status).toBe(503);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('returns 401 when the token does not match', async () => {
    vi.mocked(getRuntimeEnv).mockReturnValue(SECRET);

    const res = await POST(createRequest(signupPayload, 'Bearer wrong-secret-value'));

    expect(res.status).toBe(401);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('returns 401 when the authorization header is missing', async () => {
    vi.mocked(getRuntimeEnv).mockReturnValue(SECRET);

    const res = await POST(createRequest(signupPayload));

    expect(res.status).toBe(401);
  });

  it('returns 400 for invalid JSON with a valid token', async () => {
    vi.mocked(getRuntimeEnv).mockReturnValue(SECRET);

    const res = await POST(createRequest('not valid json {{{', `Bearer ${SECRET}`));

    expect(res.status).toBe(400);
  });

  it('ignores non-signup events', async () => {
    vi.mocked(getRuntimeEnv).mockReturnValue(SECRET);

    const res = await POST(
      createRequest({ type: 'UPDATE', table: 'users', record: signupPayload.record }, `Bearer ${SECRET}`),
    );

    expect(res.status).toBe(200);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('sends the welcome email and audits on a verified signup event', async () => {
    vi.mocked(getRuntimeEnv).mockReturnValue(SECRET);

    const res = await POST(createRequest(signupPayload, `Bearer ${SECRET}`));

    expect(res.status).toBe(200);
    expect(sendEmail).toHaveBeenCalledWith({
      type: 'welcome',
      to: 'new@example.com',
      userName: 'New User',
    });
    expect(logAudit).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({ action: 'email.welcome' }),
    );
  });
});
