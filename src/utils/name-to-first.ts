export const firstNCharsUpperCase = (
  inputString: string,
  n: number
): string => {
  if (n >= 1 && inputString.length >= n) {
    const firstNChars = inputString.slice(0, Math.max(0, n)).toUpperCase();
    return firstNChars;
  } else {
    // If n is less than 1 or the input string has fewer than n characters, return the entire string as uppercase
    return inputString.toUpperCase();
  }
};
