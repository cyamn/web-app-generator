import { z } from "zod";

export const SQLFilterSchema = z.object({
  column: z.string(),
  operator: z.enum([
    "eq",
    "neq",
    "gt",
    "gte",
    "lt",
    "lte",
    "contains",
    "not_contains",
    "starts_with",
    "ends_with",
  ]),
  value: z.union([
    z.union([z.string(), z.number(), z.boolean(), z.date()]),
    z.array(z.union([z.string(), z.number(), z.boolean(), z.date()])),
  ]),
});

export type SQLFilter = z.infer<typeof SQLFilterSchema>;

export const defaultSQLFilter: SQLFilter = {
  column: "active",
  operator: "eq",
  value: "true",
};

export const DatabaseParametersSchema = z
  .object({
    table: z.string(),
    columns: z.record(z.string()).optional(),
    filter: SQLFilterSchema.array().optional(),
  })
  .strict();

export type DatabaseParameters = z.infer<typeof DatabaseParametersSchema>;

export const defaultDatabaseParameters: DatabaseParameters = {
  table: "people",
  columns: {
    active: "Active",
    name: "Name",
    years_active: "Years Active",
  },
  filter: [defaultSQLFilter],
};

export const FormatDataParametersSchema = z
  .object({
    groupBy: z.array(z.string()).optional(),
    orderBy: z
      .record(z.union([z.literal("asc"), z.literal("desc")]))
      .optional(),
    controls: z
      .object({
        delete: z.string().optional().nullable(),
        edit: z.string().optional().nullable(),
        duplicate: z.string().optional().nullable(),
      })
      .strict()
      .optional(),
  })
  .strict();

export type FormatDataParameters = z.infer<typeof FormatDataParametersSchema>;

export const defaultFormatDataParameters: FormatDataParameters = {
  orderBy: {
    years_active: "asc",
  },
  controls: {
    delete: "Delete",
  },
};

export const DatabaseInputParametersSchema = z
  .object({
    mode: z.enum(["create", "update", "delete", "search"]),
  })
  .strict();

export type DatabaseInputFormParameters = z.infer<
  typeof DatabaseInputParametersSchema
>;

export const defaultDatabaseInputParameters = {
  mode: "create",
};
