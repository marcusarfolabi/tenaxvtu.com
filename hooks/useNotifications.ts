import { profileApi } from "@/lib/api/profile";
import { useQuery } from "@tanstack/react-query";

export const useNotifications = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await profileApi.getNotifications();
      return res.data.data; 
    },
    refetchInterval: 60000,  
  });

  return {
    notifications: data || [],
    unreadCount: data?.filter((n: any) => !n.read_at).length || 0,
    isLoading,
    error,
  };
};