import { z } from "zod";

export const ColumnSchema = z
  .object({
    name: z.string(),
    key: z.string(),
    type: z.enum(["string", "number", "boolean", "date"]),
  })
  .strict();

export type Column = z.infer<typeof ColumnSchema>;
