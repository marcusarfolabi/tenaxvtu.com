export const canAffordTransaction = (
  walletData: any, 
  amount: string | number, 
  userRole: string = 'user'
): boolean => {
  const chargeAmount = typeof amount === "string" ? parseFloat(amount || "0") : amount;
  
  if (isNaN(chargeAmount) || chargeAmount <= 0) return false;
 
  if (userRole === 'agent') {
    const providerBalance = parseFloat(walletData?.hw_balance || "0");
    return providerBalance >= chargeAmount;
  }
 
  const localBalance = parseFloat(walletData?.balance || "0");
  return localBalance >= chargeAmount;
};
 
export const getInadequateBalanceMessage = (userRole: string = 'user'): string => {
  return userRole === 'agent' 
    ? "Insufficient Provider (HonourWorld) funds. Please fund your master account."
    : "Insufficient wallet balance. Please top up to continue.";
};