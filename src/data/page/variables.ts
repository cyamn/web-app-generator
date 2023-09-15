import { z } from "zod";

export const VariablesSchema = z.record(z.any());

export type Variables = Record<string, unknown>;

export const defaultVariables: Variables = {
  foo: "bar",
  a: "42",
  calculated: "=ADD(a,7)",
};
