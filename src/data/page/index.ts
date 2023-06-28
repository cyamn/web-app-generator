import { z } from "zod";

import {
  DashboardSchema,
  defaultDashboard,
} from "../dashboard/library/dashboard";
import { defaultDatabaseView } from "../dashboard/library/database-view";

export const PageSchema = z
  .object({
    name: z.string(),
    path: z.string(),
    dashboards: z.array(DashboardSchema),
    public: z.boolean().optional(),
  })
  .strict();

export type Page = z.infer<typeof PageSchema>;

export const defaultPage: Page = {
  name: "example",
  path: "example",
  // access: defaultAccessAttributes,
  dashboards: [defaultDashboard, defaultDatabaseView],
};
