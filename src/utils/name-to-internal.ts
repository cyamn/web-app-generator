/**
 * Takes a name and makes it a valid URL.
 * @param name - The name of the page.
 * @returns A string that is a valid URL.
 */
export function nameToInternal(name: string): string {
  let i = name;
  // lowercase
  i = i.toLowerCase();
  // space -> _
  i = i.replace(" ", "_");
  // replace umlauts to
  i = i.replace(/ä/g, "ae");
  i = i.replace(/ö/g, "oe");
  i = i.replace(/ü/g, "ue");
  i = i.replace(/ß/g, "ss");
  // replace . to dot
  i = i.replace(/\./g, "dot");
  // replace special characters to _
  i = i.replace(/\W/g, "_");
  // remove double _
  i = i.replace(/_+/g, "_");
  // remove leading _
  i = i.replace(/^_/, "");
  // remove trailing _
  i = i.replace(/_$/, "");
  return i;
}
