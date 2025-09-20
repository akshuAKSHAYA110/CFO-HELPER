// Indian currency formatting utilities
export const formatINR = (amount: number, options?: { 
  showDecimals?: boolean; 
  showSymbol?: boolean; 
  compact?: boolean;
}): string => {
  const { showDecimals = true, showSymbol = true, compact = false } = options || {};
  
  // Convert to Indian numbering system (lakhs, crores)
  if (compact) {
    if (amount >= 10000000) { // 1 crore
      return `${showSymbol ? '₹' : ''}${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) { // 1 lakh
      return `${showSymbol ? '₹' : ''}${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) { // 1 thousand
      return `${showSymbol ? '₹' : ''}${(amount / 1000).toFixed(1)}K`;
    }
  }
  
  // Standard Indian formatting with commas
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
  
  return showSymbol ? formatted : formatted.replace('₹', '').trim();
};

export const parseINR = (value: string): number => {
  // Remove currency symbols and spaces
  const cleaned = value.replace(/[₹,\s]/g, '');
  
  // Handle compact notation
  if (cleaned.includes('Cr')) {
    return parseFloat(cleaned.replace('Cr', '')) * 10000000;
  } else if (cleaned.includes('L')) {
    return parseFloat(cleaned.replace('L', '')) * 100000;
  } else if (cleaned.includes('K')) {
    return parseFloat(cleaned.replace('K', '')) * 1000;
  }
  
  return parseFloat(cleaned) || 0;
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const calculateGrowth = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};