import { z } from "zod";

export const VariablesSchema = z.record(z.string());

export type Variables = z.infer<typeof VariablesSchema>;

export const defaultVariables: Variables = {
  foo: "bar",
  a: "42",
  calculated: "=ADD(a,7)",
};

// "variables": {
//   "foo": "bar",
//   "a": "42",
//   "sum": "=ADD(a,7)"
// }
