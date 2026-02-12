import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { queryKeys } from './keys';
import type { ServiceDependency } from '@/types';

export function useServiceDependencies() {
  return useQuery({
    queryKey: queryKeys.dependencies.all,
    queryFn: async (): Promise<ServiceDependency[]> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('service_dependencies')
        .select('*');
      if (error) throw error;
      return (data as ServiceDependency[]) || [];
    },
    staleTime: 5 * 60 * 1000, // 5분 캐시 — 의존성은 자주 변경되지 않음
  });
}
