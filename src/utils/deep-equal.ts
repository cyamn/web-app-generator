// eslint-disable-next-line max-lines-per-function
export function deepEqual(some1: unknown, some2: unknown): boolean {
  // Check if the objects are of the same type
  if (typeof some1 !== typeof some2) {
    return false;
  }

  if (primitiveOrNull(some1, some2)) {
    return some1 === some2;
  }

  const object1 = some1 as object;
  const object2 = some2 as object;

  const keys1 = Object.keys(object1) as (keyof typeof object1)[];
  const keys2 = Object.keys(object2) as (keyof typeof object2)[];

  // Check if the objects have the same number of properties
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Check if the objects have the same properties and values recursively
  for (const key of keys1) {
    // eslint-disable-next-line security/detect-object-injection
    if (!deepEqual(object1[key], object2[key])) {
      return false;
    }
  }
  return true;
}
function primitiveOrNull(object1: unknown, object2: unknown): boolean {
  return (
    object1 === null ||
    object2 === null ||
    typeof object1 !== "object" ||
    typeof object2 !== "object"
  );
}
