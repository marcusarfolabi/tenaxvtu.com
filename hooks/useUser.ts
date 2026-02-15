// hooks/useUsers.ts
import { useState, useEffect } from 'react';
import { profileApi } from '@/lib/api/profile';

export function useUsers({ page = 1, limit = 10 }) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await profileApi.getUsers({ limit, page });
        setData(response.data.data); // Adjust based on your API wrapper structure
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [page, limit]);

  return {
    users: data?.users || [],
    pagination: data?.pagination || { total: 0, lastPage: 1 },
    isLoading
  };
}