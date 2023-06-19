import { z } from "zod";

import { DatabaseInputFormParametersSchema } from "../parameters/database-input-form-parameters";
import {
  DatabaseParametersSchema,
  defaultDatabaseParameters,
} from "../parameters/database-parameters";

export const DatabaseInputFormSchema = z
  .object({
    type: z.string().refine((value) => value === "databaseInputForm"),
    parameters: z.object({
      data: DatabaseParametersSchema,
      input: DatabaseInputFormParametersSchema,
    }),
  })
  .strict();

export type DatabaseInputForm = z.infer<typeof DatabaseInputFormSchema>;

export const defaultDatabaseInputForm: DatabaseInputForm = {
  type: "databaseInputForm",
  parameters: {
    data: defaultDatabaseParameters,
    input: {
      mode: "create",
    },
  },
};
