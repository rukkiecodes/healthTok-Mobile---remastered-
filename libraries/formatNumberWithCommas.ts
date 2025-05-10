export const formatNumberWithCommas = (value: number | string): string => {
  const number = typeof value === 'string' ? parseFloat(value) : value;
  return number.toLocaleString('en-US');
};
