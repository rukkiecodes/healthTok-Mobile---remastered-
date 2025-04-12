export const formatCurrency = (value: number | string, currency: string = 'USD'): string => {
  const amount = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(amount)) return '';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};
