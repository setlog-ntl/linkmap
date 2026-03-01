import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendEmail } from '../sender';
import * as clientModule from '../client';

const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(clientModule, 'getResendApiKey').mockReturnValue('test-api-key');
  vi.spyOn(clientModule, 'getFromEmail').mockReturnValue('test@example.com');
  mockFetch.mockResolvedValue({ ok: true, json: async () => ({ id: 'test-id' }) });
  vi.stubGlobal('fetch', mockFetch);
});

describe('sendEmail', () => {
  it('RESEND_API_KEY가 없으면(null) false 반환', async () => {
    vi.spyOn(clientModule, 'getResendApiKey').mockReturnValue(null);
    const result = await sendEmail({ type: 'welcome', to: 'user@test.com' });
    expect(result).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('welcome 이메일을 성공적으로 발송하면 true 반환', async () => {
    const result = await sendEmail({
      type: 'welcome',
      to: 'user@test.com',
      userName: '홍길동',
    });
    expect(result).toBe(true);
    expect(mockFetch).toHaveBeenCalledOnce();
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string) as {
      to: string;
      subject: string;
    };
    expect(body.to).toBe('user@test.com');
    expect(body.subject).toContain('환영');
  });

  it('health_alert 이메일을 성공적으로 발송하면 true 반환', async () => {
    const result = await sendEmail({
      type: 'health_alert',
      to: 'user@test.com',
      serviceName: 'OpenAI',
      serviceSlug: 'openai',
      projectName: '내 프로젝트',
      environment: 'production',
      status: 'unhealthy',
      message: 'Connection timeout',
      checkedAt: new Date().toISOString(),
    });
    expect(result).toBe(true);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string) as {
      subject: string;
    };
    expect(body.subject).toContain('OpenAI');
  });

  it('team_invite 이메일을 성공적으로 발송하면 true 반환', async () => {
    const result = await sendEmail({
      type: 'team_invite',
      to: 'invitee@test.com',
      inviterName: '김철수',
      teamName: '개발팀',
      role: 'editor',
    });
    expect(result).toBe(true);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string) as {
      subject: string;
    };
    expect(body.subject).toContain('김철수');
  });

  it('subscription_change(canceled) 이메일을 성공적으로 발송하면 true 반환', async () => {
    const result = await sendEmail({
      type: 'subscription_change',
      to: 'user@test.com',
      changeType: 'canceled',
    });
    expect(result).toBe(true);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string) as {
      subject: string;
    };
    expect(body.subject).toContain('해지');
  });

  it('Resend API 오류 응답 시 false 반환 (throw 없음)', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'API error' }),
    });
    const result = await sendEmail({ type: 'welcome', to: 'user@test.com' });
    expect(result).toBe(false);
  });

  it('예외 발생 시 false 반환 (throw 없음)', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    const result = await sendEmail({ type: 'welcome', to: 'user@test.com' });
    expect(result).toBe(false);
  });
});
