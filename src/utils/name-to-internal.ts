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
  index = index.replace(/ä/g, "ae");
  index = index.replace(/ö/g, "oe");
  index = index.replace(/ü/g, "ue");
  index = index.replace(/ß/g, "ss");
  // replace . to dot
  index = index.replace(/\./g, "dot");
  // replace special characters to _
  index = index.replace(/\W/g, "_");
  // remove double _
  index = index.replace(/_+/g, "_");
  // remove leading _
  index = index.replace(/^_/, "");
  // remove trailing _
  index = index.replace(/_$/, "");
  return index;
}
