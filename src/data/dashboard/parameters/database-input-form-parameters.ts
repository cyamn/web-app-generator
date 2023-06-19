import { z } from "zod";

export const DatabaseInputFormParametersSchema = z
  .object({
    mode: z.enum(["create", "update", "delete", "search"]),
  })
  .strict();

export type DatabaseInputFormParameters = z.infer<
  typeof DatabaseInputFormParametersSchema
>;

export const defaultDatabaseInputFormParameters = {
  mode: "create",
};
