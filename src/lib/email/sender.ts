import { getResendApiKey, getFromEmail } from './client';
import {
  buildWelcomeEmail,
  buildHealthAlertEmail,
  buildTeamInviteEmail,
  buildSubscriptionChangeEmail,
} from './templates';
import type { EmailPayload } from './types';

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const apiKey = getResendApiKey();
  if (!apiKey) return false;

  try {
    let subject: string;
    let html: string;

    switch (payload.type) {
      case 'welcome': {
        const built = buildWelcomeEmail(payload.userName);
        subject = built.subject;
        html = built.html;
        break;
      }
      case 'health_alert': {
        const built = buildHealthAlertEmail({
          serviceName: payload.serviceName,
          serviceSlug: payload.serviceSlug,
          projectName: payload.projectName,
          environment: payload.environment,
          status: payload.status,
          message: payload.message,
          checkedAt: payload.checkedAt,
        });
        subject = built.subject;
        html = built.html;
        break;
      }
      case 'team_invite': {
        const built = buildTeamInviteEmail({
          inviterName: payload.inviterName,
          teamName: payload.teamName,
          role: payload.role,
        });
        subject = built.subject;
        html = built.html;
        break;
      }
      case 'subscription_change': {
        const built = buildSubscriptionChangeEmail({
          changeType: payload.changeType,
          plan: payload.plan,
          status: payload.status,
        });
        subject = built.subject;
        html = built.html;
        break;
      }
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: getFromEmail(),
        to: payload.to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn('[email] Send failed:', err);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('[email] Unexpected error during send:', err);
    return false;
  }
}
