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
      // maybeSingle: 구독 레코드가 없어도(신규/무료 사용자) 406이 아닌 200 + null 반환
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      // 테이블 미존재 또는 스키마 불일치(PGRST204/406) → free 플랜으로 폴백
      if (error?.code === 'PGRST204' || error?.message?.includes('406')) return null;
      if (error) throw error;
      return (data as Subscription) ?? null;
    },
    staleTime: 1000 * 60 * 5,
  });
}
