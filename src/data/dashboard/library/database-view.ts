import { z } from "zod";

import {
  DatabaseParametersSchema,
  defaultDatabaseParameters,
} from "../parameters/database-parameters";
import {
  defaultFormatDataParameters,
  FormatDataParametersSchema,
} from "../parameters/format-data-parameters";

export const DatabaseViewSchema = z
  .object({
    type: z.string().refine((value) => value === "databaseView"),
    parameters: z.object({
      data: DatabaseParametersSchema,
      format: FormatDataParametersSchema,
    }),
  })
  .strict();

export type DatabaseView = z.infer<typeof DatabaseViewSchema>;

export const defaultDatabaseView: DatabaseView = {
  type: "databaseView",
  parameters: {
    data: defaultDatabaseParameters,
    format: defaultFormatDataParameters,
  },
};
