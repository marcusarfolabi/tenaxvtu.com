export const canAffordTransaction = (balanceData: any, amount: string | number, role: string = 'customer') => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount || "0") : amount;
  if (!numAmount || numAmount <= 0) return true; 
 
  if (role === 'agent') {
    return parseFloat(balanceData?.hw_balance || "0") >= numAmount;
  }

  return parseFloat(balanceData?.balance || "0") >= numAmount;
};
 
export const getInadequateBalanceMessage = (userRole: string = 'user'): string => {
  return userRole === 'agent' 
    ? "Insufficient Provider (HonourWorld) funds. Please fund your master account."
    : "Insufficient wallet balance. Please top up to continue.";
};