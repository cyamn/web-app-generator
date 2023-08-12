import { z } from "zod";

export const ColumnSchema = z
  .object({
    key: z.string(),
    type: z.enum(["string", "number", "boolean", "date"]),
  })
  .strict();

export const CellSchema = z.object({
  id: z.string(),
  value: z.string(),
});

export const TableSchema = z
  .object({
    name: z.string(),
    columns: z.array(ColumnSchema),
    cells: z.array(z.array(CellSchema)),
  })
  .strict();

export type Table = z.infer<typeof TableSchema>;
