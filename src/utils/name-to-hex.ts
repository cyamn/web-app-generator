// converts a string to a hex color
export const stringToHex = function (string_: string): string {
  let hash = 0;
  for (let index = 0; index < string_.length; index++) {
    hash = string_.codePointAt(index)! + ((hash << 5) - hash);
  }
  let hexC = "#";
  for (let index = 0; index < 3; index++) {
    const value = (hash >> (index * 8)) & 0xff;
    hexC += ("00" + value.toString(16)).slice(-2);
  }
  return hexC;
};
