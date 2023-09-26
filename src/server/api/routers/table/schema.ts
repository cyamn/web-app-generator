import { z } from "zod";

export const columnTypes = ["string", "number", "boolean", "date"] as const;

export const ColumnSchema = z
  .object({
    id: z.string(),
    key: z.string(),
    type: z.enum(columnTypes),
  })
  .strict();

export type Column = z.infer<typeof ColumnSchema>;

export const CellSchema = z.object({
  id: z.string(),
  value: z.string(),
  col: z.string(),
  row: z.string(),
});

export type Cell = z.infer<typeof CellSchema>;

export const TableSchema = z
  .object({
    name: z.string(),
    id: z.string(),
    columns: z.array(ColumnSchema),
    cells: z.array(z.array(CellSchema)),
  })
  .strict();

export type Table = z.infer<typeof TableSchema>;
