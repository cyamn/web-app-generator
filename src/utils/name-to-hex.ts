// converts a string to a hex color
export const stringToHex = (name: string): string => {
  // Generate a hash from the name
  let hash = 0;
  for (let index = 0; index < name.length; index++) {
    const code = name.codePointAt(index) ?? 0;
    hash = code + ((hash << 5) - hash);
  }

  // Convert the hash to a hex color code
  const color = (hash & 0x00_ff_ff_ff).toString(16).toUpperCase();

  // Pad the color code with zeros if necessary
  return "#" + "00000".slice(0, Math.max(0, 6 - color.length)) + color;
};
