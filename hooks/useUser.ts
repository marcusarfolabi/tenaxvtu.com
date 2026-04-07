import { useState, useEffect, useCallback } from "react";
import { profileApi } from "@/lib/api/profile";
import toast from "react-hot-toast";

export function useUsers({ page = 1, limit = 10 }) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchUsers = useCallback(
    async (silent = false) => {
      if (!silent) setIsLoading(true);
      setIsRefreshing(true);

      try {
        const response = await profileApi.getUsers({ limit, page });
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
        toast.error("Could not sync user network");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [page, limit],
  );
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Inside useUsers hook
  const updateUserStatus = async (
    userId: number,
    newStatus: string,
    onSuccess?: () => void,
  ) => {
    setIsUpdating(true);
    try {
      await profileApi.updateStatus({
        user_id: userId,
        status: newStatus,
      });
      toast.success("Account status updated");
      await fetchUsers(true);

      // Execute the callback if it exists
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    users: data?.users || [],
    summary: data?.summary || {
      total_verified_emails: 0,
      total_kyc_completed: 0,
      total_with_virtual_accounts: 0,
    },
    pagination: data?.pagination || { total: 0, lastPage: 1 },
    isLoading,
    isUpdating,
    isRefreshing,
    updateUserStatus,
    refreshUsers: () => fetchUsers(true),
  };
}
