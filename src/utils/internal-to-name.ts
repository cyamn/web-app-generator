/**
 * Takes a URL string and converts it back to the original name.
 * @param url - The URL string to convert.
 * @returns A string that represents the original name.
 */
export function internalToName(url: string): string {
  let name = url;
  // replace trailing _ with _
  name = name.replace(/_$/, "");
  // replace leading _ with _
  name = name.replace(/^_/, "");
  // replace double _ with _
  name = name.replace(/_+/g, "_");
  // replace special characters with _
  name = name.replace(/_/g, " ");
  // replace dot with .
  name = name.replace(/dot/g, ".");
  // replace ss with ß
  name = name.replace(/ss/g, "ß");
  // replace ue with ü
  name = name.replace(/ue/g, "ü");
  name = name.replace(/oe/g, "ö");
  name = name.replace(/ae/g, "ä");
  // replace _ with space
  name = name.replace(/_/g, " ");
  // capitalize first letter
  name = name.charAt(0).toUpperCase() + name.slice(1);
  return name;
}
