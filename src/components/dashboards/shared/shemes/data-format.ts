import { z } from "zod";

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
  orderBy: {},
  controls: {},
};
