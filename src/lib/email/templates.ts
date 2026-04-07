function wrapHtml(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Pretendard Variable',Pretendard,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1d4ed8 0%,#0891b2 100%);padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">Linkmap</h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">외부 서비스 연결 시각화 플랫폼</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f1f5f9;padding:24px 40px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#64748b;font-size:12px;line-height:1.6;">
                이 이메일은 Linkmap에서 자동 발송되었습니다.<br />
                더 이상 이메일을 받지 않으려면 계정 설정에서 알림을 끄세요.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildWelcomeEmail(userName?: string): { subject: string; html: string } {
  const name = userName ?? '사용자';
  return {
    subject: 'Linkmap에 오신 것을 환영합니다!',
    html: wrapHtml('Linkmap 가입 환영', `
      <h2 style="margin:0 0 16px;color:#0f172a;font-size:22px;font-weight:700;">안녕하세요, ${name}님!</h2>
      <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.7;">
        Linkmap에 가입해 주셔서 감사합니다.<br />
        외부 서비스 연결을 시각화하고 API 키·환경변수를 안전하게 관리해 보세요.
      </p>
      <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
        <tr>
          <td style="background:linear-gradient(135deg,#1d4ed8,#0891b2);border-radius:8px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://linkmap.app'}/dashboard"
               style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">
              대시보드 시작하기 →
            </a>
          </td>
        </tr>
      </table>
      <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6;">
        궁금한 점이 있으면 언제든지 문의해 주세요.
      </p>
    `),
  };
}

export function buildHealthAlertEmail(params: {
  serviceName: string;
  serviceSlug: string;
  projectName: string;
  environment: string;
  status: 'unhealthy' | 'degraded';
  message: string;
  checkedAt: string;
}): { subject: string; html: string } {
  const statusLabel = params.status === 'unhealthy' ? '오류' : '성능 저하';
  const statusColor = params.status === 'unhealthy' ? '#dc2626' : '#d97706';
  const statusBg = params.status === 'unhealthy' ? '#fef2f2' : '#fffbeb';

  return {
    subject: `[Linkmap 알림] ${params.serviceName} 서비스 ${statusLabel} 감지`,
    html: wrapHtml(`${params.serviceName} 헬스체크 알림`, `
      <h2 style="margin:0 0 8px;color:#0f172a;font-size:20px;font-weight:700;">서비스 이상 감지</h2>
      <p style="margin:0 0 24px;color:#64748b;font-size:14px;">
        ${new Date(params.checkedAt).toLocaleString('ko-KR')} 기준
      </p>
      <div style="background:${statusBg};border:1px solid ${statusColor};border-radius:8px;padding:16px;margin:0 0 24px;">
        <p style="margin:0;color:${statusColor};font-size:14px;font-weight:600;">
          ● 상태: ${statusLabel.toUpperCase()}
        </p>
        <p style="margin:8px 0 0;color:#334155;font-size:13px;">${params.message}</p>
      </div>
      <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:0 0 24px;">
        <tr style="background:#f8fafc;">
          <td style="padding:10px 16px;border:1px solid #e2e8f0;font-size:13px;color:#64748b;font-weight:600;width:120px;">프로젝트</td>
          <td style="padding:10px 16px;border:1px solid #e2e8f0;font-size:13px;color:#0f172a;">${params.projectName}</td>
        </tr>
        <tr>
          <td style="padding:10px 16px;border:1px solid #e2e8f0;font-size:13px;color:#64748b;font-weight:600;">서비스</td>
          <td style="padding:10px 16px;border:1px solid #e2e8f0;font-size:13px;color:#0f172a;">${params.serviceName}</td>
        </tr>
        <tr style="background:#f8fafc;">
          <td style="padding:10px 16px;border:1px solid #e2e8f0;font-size:13px;color:#64748b;font-weight:600;">환경</td>
          <td style="padding:10px 16px;border:1px solid #e2e8f0;font-size:13px;color:#0f172a;">${params.environment}</td>
        </tr>
      </table>
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:linear-gradient(135deg,#1d4ed8,#0891b2);border-radius:8px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://linkmap.app'}/dashboard"
               style="display:inline-block;padding:12px 24px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">
              대시보드에서 확인하기 →
            </a>
          </td>
        </tr>
      </table>
    `),
  };
}

export function buildTeamInviteEmail(params: {
  inviterName: string;
  teamName: string;
  role: 'admin' | 'editor' | 'viewer';
}): { subject: string; html: string } {
  const roleLabel = { admin: '관리자', editor: '편집자', viewer: '뷰어' }[params.role];

  return {
    subject: `[Linkmap] ${params.inviterName}님이 팀에 초대했습니다`,
    html: wrapHtml('팀 초대', `
      <h2 style="margin:0 0 16px;color:#0f172a;font-size:20px;font-weight:700;">팀 초대</h2>
      <p style="margin:0 0 24px;color:#334155;font-size:15px;line-height:1.7;">
        <strong>${params.inviterName}</strong>님이 <strong>${params.teamName}</strong> 팀에
        <span style="color:#1d4ed8;font-weight:600;">${roleLabel}</span> 역할로 초대했습니다.
      </p>
      <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px;margin:0 0 24px;">
        <p style="margin:0;color:#0369a1;font-size:13px;line-height:1.6;">
          Linkmap에 로그인하면 팀 워크스페이스에 자동으로 접근할 수 있습니다.
        </p>
      </div>
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:linear-gradient(135deg,#1d4ed8,#0891b2);border-radius:8px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://linkmap.app'}/dashboard"
               style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">
              팀 워크스페이스 열기 →
            </a>
          </td>
        </tr>
      </table>
    `),
  };
}

export function buildSubscriptionChangeEmail(params: {
  changeType: 'upgraded' | 'updated' | 'canceled' | 'refunded';
  plan?: string;
  status?: string;
}): { subject: string; html: string } {
  const messages: Record<string, { title: string; body: string; color: string }> = {
    upgraded: {
      title: '구독이 업그레이드되었습니다',
      body: `<strong>${params.plan ?? 'Pro'}</strong> 플랜으로 업그레이드되었습니다. 모든 고급 기능을 이용할 수 있습니다.`,
      color: '#16a34a',
    },
    updated: {
      title: '구독 정보가 변경되었습니다',
      body: `구독 상태가 <strong>${params.status ?? '업데이트됨'}</strong>으로 변경되었습니다.`,
      color: '#2563eb',
    },
    canceled: {
      title: '구독이 해지되었습니다',
      body: '구독이 해지되어 무료 플랜으로 전환되었습니다. 언제든 다시 구독할 수 있습니다.',
      color: '#dc2626',
    },
    refunded: {
      title: '환불이 완료되었습니다',
      body: '요청하신 환불이 정상적으로 처리되었습니다. 환불 금액은 결제 수단에 따라 영업일 기준 3~5일 내에 반영됩니다.',
      color: '#f59e0b',
    },
  };

  const info = messages[params.changeType];

  return {
    subject: `[Linkmap] ${info.title}`,
    html: wrapHtml(info.title, `
      <h2 style="margin:0 0 16px;color:#0f172a;font-size:20px;font-weight:700;">${info.title}</h2>
      <p style="margin:0 0 24px;color:#334155;font-size:15px;line-height:1.7;">
        ${info.body}
      </p>
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:linear-gradient(135deg,#1d4ed8,#0891b2);border-radius:8px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://linkmap.app'}/settings/billing"
               style="display:inline-block;padding:12px 24px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">
              구독 관리 →
            </a>
          </td>
        </tr>
      </table>
    `),
  };
}
