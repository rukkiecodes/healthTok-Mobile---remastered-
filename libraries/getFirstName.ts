const getFirstWord = (str?: string): string => {
  // Return an empty string if input is undefined, null, or empty
  if (!str) return '';

  // Split the string into words and return the first one
  const words = str.split(' ');
  return words[0] || ''; // Use a fallback to handle edge cases
};

export default getFirstWord;
