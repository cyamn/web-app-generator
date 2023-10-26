import { z } from "zod";

export const ColumnSchema = z
  .object({
    key: z.string(),
    type: z.enum(["string", "number", "boolean", "date", "user"]),
  })
  .strict();

export type Column = z.infer<typeof ColumnSchema>;

export const defaultColumn: Column = {
  key: "col",
  type: "string",
};
