import { z } from "zod";

import {
  DashboardSchema,
  defaultDashboard,
} from "../dashboard/library/dashboard";
import { defaultDatabaseView } from "../dashboard/library/database-view";
import { AccessSchema, defaultAccess } from "./access";

export const PageSchema = z
  .object({
    name: z.string(),
    path: z.string(),
    access: AccessSchema.optional(),
    dashboards: z.array(DashboardSchema),
  })
  .strict();

export type Page = z.infer<typeof PageSchema>;

export const defaultPage: Page = {
  name: "example",
  path: "example",
  access: defaultAccess,
  dashboards: [defaultDashboard, defaultDatabaseView],
};
