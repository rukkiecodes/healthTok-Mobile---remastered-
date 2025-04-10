const getLastWord = (str?: string): string => {
  // Return an empty string if input is undefined, null, or empty
  if (!str) return '';

  // Split the string into words and return the last one
  const words = str.trim().split(' ');
  return words[words.length - 1] || ''; // Use a fallback to handle edge cases
};

export default getLastWord;
