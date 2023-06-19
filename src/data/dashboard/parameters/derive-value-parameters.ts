import { z } from "zod";

export const DeriveValueParametersSchema = z
  .object({
    aggregate: z.enum(["sum", "avg", "min", "max", "count"]),
  })
  .strict();

export type DeriveValueParameters = z.infer<typeof DeriveValueParametersSchema>;

export const defaultDeriveValueParameters = {
  aggregate: "sum",
};
