import { z } from "zod";

export const FormatDataParametersSchema = z
  .object({
    groupBy: z.array(z.string()).optional(),
    orderBy: z
      .record(z.union([z.literal("asc"), z.literal("desc")]))
      .optional(),
  })
  .strict();

export type FormatDataParameters = z.infer<typeof FormatDataParametersSchema>;

export const defaultFormatDataParameters: FormatDataParameters = {
  orderBy: {
    years_active: "asc",
  },
};
