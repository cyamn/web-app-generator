import { expect } from "vitest";

import { deepEqual } from "./deep-equal";

const objectA = { a: "A", b: "B", c: { foo: "bar", fizz: "buzz" } };

const objectB = { a: "A", b: "B", c: { foo: "bar", fizz: "buzz" } };

const objectC = { a: "A", b: "B", c: { foo: "bar", fizz: "buzz", extra: "!" } };

describe("deep equal function", () => {
  it("should return true if objects are equal", () => {
    expect(deepEqual(objectA, objectB)).toBe(true);
  });

  it("should return false if objects are not equal", () => {
    expect(deepEqual(objectA, objectC)).toBe(false);
  });
});
