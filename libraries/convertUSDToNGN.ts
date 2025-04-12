export const convertUSDToNGN = async (amount: number): Promise<string | null> => {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await response.json();

    if (data && data.rates && data.rates.NGN) {
      const rate = data.rates.NGN;
      const convertedAmount = amount * rate;
      return convertedAmount.toFixed(2);
    } else {
      console.warn('NGN rate not found in the response.');
      return null;
    }
  } catch (error) {
    console.error('Currency conversion error:', error);
    return null;
  }
};
