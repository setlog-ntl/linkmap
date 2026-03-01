import { getResendClient, getFromEmail } from './client';
import {
  buildWelcomeEmail,
  buildHealthAlertEmail,
  buildTeamInviteEmail,
  buildSubscriptionChangeEmail,
} from './templates';
import type { EmailPayload } from './types';

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const client = getResendClient();
  if (!client) return false;

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

    const { error } = await client.emails.send({
      from: getFromEmail(),
      to: payload.to,
      subject,
      html,
    });

    if (error) {
      console.warn('[email] Send failed:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('[email] Unexpected error during send:', err);
    return false;
  }
}
