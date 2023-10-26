import { z } from "zod";

export const DatabaseInputParametersSchema = z
  .object({
    mode: z.enum(["create", "update", "delete", "search"]),
  })
  .strict();

export type DatabaseInputFormParameters = z.infer<
  typeof DatabaseInputParametersSchema
>;

export const defaultDatabaseInputParameters: DatabaseInputFormParameters = {
  mode: "create",
};
