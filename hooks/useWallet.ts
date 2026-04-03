"use client";

import { walletApi } from "@/lib/api/wallet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface UseWalletProps {
  page?: number;
  limit?: number;
  type?: string;
  role?: string;
}

export const useWallet = ({
  page = 1,
  limit = 4,
  type = "all",
  role = "customer",
}: UseWalletProps = {}) => {
  const queryClient = useQueryClient();
  const REFRESH_INTERVAL = 120000;

  const {
    data: balance,
    isLoading: isBalanceLoading,
    isFetching: isRefetching,
    error: balanceError,
    refetch: triggerRefetch,
  } = useQuery({
    queryKey: ["wallet-balance", role],
    queryFn: async () => {
      const res =
        role === "agent"
          ? await walletApi.getAgentBalance()
          : await walletApi.getBalance();

      const rawData = res.data.data;

      return {
        balance: rawData.balance || "0.00",
        commission: rawData.commission || "0.00",
        currency: rawData.currency === "NGN" ? "₦" : rawData.currency || "₦",
        hw_balance: rawData.hw_balance || 0,
        hw_commission: rawData.hw_commission || 0,
        ...rawData,  
      };
    },
    refetchInterval: REFRESH_INTERVAL,
    staleTime: REFRESH_INTERVAL,
  });

  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey: ["wallet-history", page, limit, type],
    queryFn: async () => {
      const res = await walletApi.getHistory({ page, limit, type });
      return res.data.data;
    },
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 5000,
  });

  const refreshWallet = () => {
    triggerRefetch();
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
    },
  });

  return {
    // Data
    balance,
    hwProviderBalance: balance?.hw_balance || 0,
    hwProviderCommission: balance?.hw_commission || 0,
    transactions: historyData?.history?.data || [],

    // Status
    isLoading: isBalanceLoading || isHistoryLoading,
    isBalanceLoading,
    isHistoryLoading,
    isRefetching,
    balanceError,

    refreshWallet,
    transferCommission,

    stats: {
      total_amount: historyData?.total_amount || 0,
    },
    pagination: {
      total: historyData?.history?.total || 0,
      current_page: historyData?.history?.current_page || 1,
      last_page: historyData?.history?.last_page || 1,
      per_page: historyData?.history?.per_page || limit,
    },
  };
};
