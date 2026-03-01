export type EmailPayload =
  | { type: 'welcome'; to: string; userName?: string }
  | {
      type: 'health_alert';
      to: string;
      serviceName: string;
      serviceSlug: string;
      projectName: string;
      environment: string;
      status: 'unhealthy' | 'degraded';
      message: string;
      checkedAt: string;
    }
  | {
      type: 'team_invite';
      to: string;
      inviterName: string;
      teamName: string;
      role: 'admin' | 'editor' | 'viewer';
    }
  | {
      type: 'subscription_change';
      to: string;
      changeType: 'upgraded' | 'updated' | 'canceled';
      plan?: string;
      status?: string;
    };
