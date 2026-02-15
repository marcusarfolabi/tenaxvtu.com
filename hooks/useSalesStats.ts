import useSWR from 'swr';
import { profileApi } from '@/lib/api/profile';

export function useSalesStats(filters: { from: string; to: string }, initialData?: any) {
  const { data, error, isLoading, mutate } = useSWR(
    ['/user/sales-stats', filters.from, filters.to],
    () => profileApi.getStats(filters).then(res => res.data.data),
    {
      fallbackData: initialData,
      refreshInterval: 60000, // 60 seconds
      revalidateOnFocus: true,
    }
  );

  console.log(data);
  return {
    stats: data,
    isLoading,
    isError: error,
    refresh: mutate
  };
}