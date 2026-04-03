import { detectNetwork } from "@/util/detectNetwork";
import { useCallback } from "react";

/**
 * A reusable hook for handling phone input and auto-detecting
 * Nigerian telecom networks.
 */
export function useNetworkDetection(setFormData: any) {
  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;

      // 1. Clean: Remove everything except digits
      const cleaned = val.replace(/\D/g, "");
 
      const detected = detectNetwork(cleaned);

      setFormData((prev: any) => ({
        ...prev,
        phone: cleaned, 
        network: detected || prev.network,
      }));
    },
    [setFormData],
  );

  return { handlePhoneChange };
}
