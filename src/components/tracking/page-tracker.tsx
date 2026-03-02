'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const track = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) return; // 로그인 사용자는 추적 안 함

      const STORAGE_KEY = 'visitor_session_id';
      let sessionId = sessionStorage.getItem(STORAGE_KEY);
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem(STORAGE_KEY, sessionId);
      }

      const payload = {
        session_id: sessionId,
        page_path: window.location.pathname,
        referrer: document.referrer || undefined,
        user_agent: navigator.userAgent,
      };

      // fire-and-forget
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => undefined);
    };

    track().catch(() => undefined);
  }, [pathname]);

  return null;
}
