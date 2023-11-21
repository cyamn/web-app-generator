/**
 * Takes a name and makes it a valid URL.
 * @param name - The name of the page.
 * @returns A string that is a valid URL.
 */
export function nameToInternal(name: string): string {
  let index = name;
  // lowercase
  index = index.toLowerCase();
  // space -> _
  index = index.replace(" ", "_");
  // replace umlauts to
  index = index.replaceAll("ä", "ae");
  index = index.replaceAll("ö", "oe");
  index = index.replaceAll("ü", "ue");
  index = index.replaceAll("ß", "ss");
  // replace . to dot
  index = index.replaceAll(".", "dot");
  // replace special characters to _
  index = index.replaceAll(/\W/g, "_");
  // remove double _
  index = index.replaceAll(/_+/g, "_");
  // remove leading _
  index = index.replace(/^_/, "");
  // remove trailing _
  index = index.replace(/_$/, "");
  return index;
}
