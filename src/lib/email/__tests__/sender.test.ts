import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendEmail } from '../sender';
import * as clientModule from '../client';

const mockSend = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  mockSend.mockResolvedValue({ data: { id: 'test-id' }, error: null });
  vi.spyOn(clientModule, 'getResendClient').mockReturnValue({
    emails: { send: mockSend },
  } as unknown as ReturnType<typeof clientModule.getResendClient>);
  vi.spyOn(clientModule, 'getFromEmail').mockReturnValue('test@example.com');
});

describe('sendEmail', () => {
  it('RESEND_API_KEY가 없으면(null client) false 반환', async () => {
    vi.spyOn(clientModule, 'getResendClient').mockReturnValue(null);
    const result = await sendEmail({ type: 'welcome', to: 'user@test.com' });
    expect(result).toBe(false);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('welcome 이메일을 성공적으로 발송하면 true 반환', async () => {
    const result = await sendEmail({
      type: 'welcome',
      to: 'user@test.com',
      userName: '홍길동',
    });
    expect(result).toBe(true);
    expect(mockSend).toHaveBeenCalledOnce();
    const call = mockSend.mock.calls[0][0] as { to: string; subject: string };
    expect(call.to).toBe('user@test.com');
    expect(call.subject).toContain('환영');
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
    const call = mockSend.mock.calls[0][0] as { subject: string };
    expect(call.subject).toContain('OpenAI');
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
    const call = mockSend.mock.calls[0][0] as { subject: string };
    expect(call.subject).toContain('김철수');
  });

  it('subscription_change(canceled) 이메일을 성공적으로 발송하면 true 반환', async () => {
    const result = await sendEmail({
      type: 'subscription_change',
      to: 'user@test.com',
      changeType: 'canceled',
    });
    expect(result).toBe(true);
    const call = mockSend.mock.calls[0][0] as { subject: string };
    expect(call.subject).toContain('해지');
  });

  it('Resend API 오류 시 false 반환 (throw 없음)', async () => {
    mockSend.mockResolvedValue({ data: null, error: { message: 'API error' } });
    const result = await sendEmail({ type: 'welcome', to: 'user@test.com' });
    expect(result).toBe(false);
  });

  it('예외 발생 시 false 반환 (throw 없음)', async () => {
    mockSend.mockRejectedValue(new Error('Network error'));
    const result = await sendEmail({ type: 'welcome', to: 'user@test.com' });
    expect(result).toBe(false);
  });
});
