import { z } from "zod";

export const projectIDSchema = z.object({
  project: z.string(),
});

export const projectTableSchema = z.object({
  ...projectIDSchema.shape,
  tableName: z.string(),
});

export const TableFilterSchema = z.array(
  z.object({
    column: z.string(),
    operator: z.string(),
    value: z.any(),
  })
);

export type TableFilter = {
  column: string;
  operator: string;
  value: string | number | boolean | object;
};

export const projectTableColumnSchema = z.object({
  ...projectTableSchema.shape,
  columns: z.preprocess((value) => {
    if (typeof value === "string") return [value];
    return value;
  }, z.array(z.string()).optional()),
  filter: TableFilterSchema.optional(),
});

export const idListSchema = z.array(
  z.object({ id: z.string(), name: z.string() })
);

export const CSVDataSchema = z.object({
  csv: z.string(),
  name: z.string(),
});
