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
  name = name.replaceAll(/_+/g, "_");
  // replace special characters with _
  name = name.replaceAll("_", " ");
  // replace dot with .
  name = name.replaceAll("dot", ".");
  // replace ss with ß
  name = name.replaceAll("ss", "ß");
  // replace ue with ü
  name = name.replaceAll("ue", "ü");
  name = name.replaceAll("oe", "ö");
  name = name.replaceAll("ae", "ä");
  // replace _ with space
  name = name.replaceAll("_", " ");
  // capitalize first letter
  name = name.charAt(0).toUpperCase() + name.slice(1);
  return name;
}
