/**
 * This function takes a word as input and capitalizes the first letter of the word.
 * 
 * @param {string} word - The word to be capitalized.
 * @returns {string} - The capitalized word.
 */
const capitalizeWord = (word: string): string => {
    // Step 1: Get the first character of the word and capitalize it.
    const capitalized = word.charAt(0).toUpperCase();

    // Step 2: Get the remaining characters of the word (excluding the first character).
    const remainingChars = word.slice(1);

    // Step 3: Combine the capitalized first character with the remaining characters.
    const capitalizedWord = capitalized + remainingChars;

    // Step 4: Return the capitalized word.
    return capitalizedWord;
}

export default capitalizeWord;
