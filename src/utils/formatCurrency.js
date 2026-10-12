/**
 * Format numerical amounts to Indian Rupee (INR ₹) or custom currency
 * @param {number|string} amount
 * @param {string} currency - Default 'INR'
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'INR') => {
  const numericAmount = Number(amount) || 0;
  if (numericAmount === 0) return 'Free';

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(numericAmount);
  } catch (error) {
    return `₹${numericAmount.toLocaleString('en-IN')}`;
  }
};

export default formatCurrency;
