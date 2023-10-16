import { z } from "zod";

import { DashboardSchema } from "@/components/dashboards";

import { AccessSchema, defaultAccess } from "./access";
import { VariablesSchema } from "./variables";

export const PageSchema = z
  .object({
    name: z.string(),
    path: z.string(),
    access: AccessSchema.optional(),
    variables: VariablesSchema.optional(),
    dashboards: z.array(DashboardSchema),
  })
  .strict();

export type Page = z.infer<typeof PageSchema>;

export const defaultPage: Page = {
  name: "example",
  path: "example",
  access: defaultAccess,
  dashboards: [],
};
