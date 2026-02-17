import { useState, useEffect } from "react";
import { profileApi } from "@/lib/api/profile";
import toast from "react-hot-toast";

export function useUsers({ page = 1, limit = 10 }) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await profileApi.getUsers({ limit, page });
      setData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit]);

  const updateUserStatus = async (userId: number, newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await profileApi.updateStatus({
        user_id: userId,
        status: newStatus,
      });
      toast.success("Account status updated");
      await fetchUsers(); // Refresh list
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    users: data?.users || [],
    pagination: data?.pagination || { total: 0, lastPage: 1 },
    isLoading,
    isUpdating,
    updateUserStatus,
  };
}
