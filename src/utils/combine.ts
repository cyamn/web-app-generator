export function combine<T, U>(
  array1: T[],
  array2: U[]
): [T | null, U | null][] {
  const result: [T | null, U | null][] = [];
  const maxLength = Math.max(array1.length, array2.length);

  for (let index = 0; index < maxLength; index++) {
    const tuple: [T | null, U | null] = [null, null];

    if (index < array1.length) {
      tuple[0] = array1[index % maxLength] ?? null;
    }

    if (index < array2.length) {
      tuple[1] = array2[index % maxLength] ?? null;
    }

    result.push(tuple);
  }

  return result;
}
