"use client";

import { walletApi } from "@/lib/api/wallet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface UseWalletProps {
  page?: number;
  limit?: number;
  type?: string;
}

export const useWallet = ({ page = 1, limit = 4, type = 'all' }: UseWalletProps = {}) => {
  const queryClient = useQueryClient();
  const REFRESH_INTERVAL = 120000;

  const { 
    data: balance, 
    isLoading: isBalanceLoading, 
    error: balanceError 
  } = useQuery({
    queryKey: ["wallet-balance"],
    queryFn: async () => {
      const res = await walletApi.getBalance();
      return res.data.data; 
    },
    refetchInterval: REFRESH_INTERVAL, 
    staleTime: REFRESH_INTERVAL,
  });

  const { 
    data: historyData, 
    isLoading: isHistoryLoading 
  } = useQuery({
    queryKey: ["wallet-history", page, limit, type],
    queryFn: async () => {
      const res = await walletApi.getHistory({ page, limit, type });
      // This now returns { history: {...}, total_amount: ... } from your Service
      return res.data.data; 
    },
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 5000,
  });

  // HELPER: Manual refresh function
  const refreshWallet = () => {
    queryClient.invalidateQueries({ queryKey: ["wallet-balance"] });
    queryClient.invalidateQueries({ queryKey: ["wallet-history"] });
  };

  const transferCommission = useMutation({
    mutationFn: (type: "commission") => walletApi.transferCommission(type),
    onSuccess: () => { 
      refreshWallet();
      toast.success("Funds transferred to main balance!");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Transfer failed";
      toast.error(message);
    }
  });

  return {
    balance,
    // Note: Adjusted paths to match your service's new return ['history' => ..., 'total_amount' => ...]
    transactions: historyData?.history?.data || [], 
    stats: {
      total_amount: historyData?.total_amount || 0
    },
    pagination: {
      total: historyData?.history?.total || 0,
      current_page: historyData?.history?.current_page || 1,
      last_page: historyData?.history?.last_page || 1,
      per_page: historyData?.history?.per_page || limit,
    },
    isLoading: isBalanceLoading || isHistoryLoading,
    refreshWallet, // Added this back
    isBalanceLoading,
    isHistoryLoading,
    balanceError,
    transferCommission,
  };
};