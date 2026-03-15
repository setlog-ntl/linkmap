import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { queryKeys } from './keys';
import type { Subscription } from '@/types';

const supabase = createClient();

export function useSubscription() {
  return useQuery({
    queryKey: queryKeys.subscription.current,
    queryFn: async (): Promise<Subscription | null> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (error?.code === 'PGRST116') return null; // 레코드 없음 → free 플랜
      // 406: 테이블 미존재 또는 스키마 불일치 → free 플랜으로 폴백
      if (error?.code === 'PGRST204' || error?.message?.includes('406')) return null;
      if (error) throw error;
      return data as Subscription;
    },
    staleTime: 1000 * 60 * 5,
  });
}
