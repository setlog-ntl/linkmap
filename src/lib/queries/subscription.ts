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
      if (error) throw error;
      return data as Subscription;
    },
    staleTime: 1000 * 60 * 5,
  });
}
