import { z } from "zod";

import {
  DashboardSchema,
  defaultDashboard,
} from "../dashboard/library/dashboard";
import { defaultDatabaseView } from "../dashboard/library/database-view";
// import { ScopeSchema } from "../dynamic";
import {
  AccessAttributesSchema,
  defaultAccessAttributes,
} from "./access-attributes";
import { defaultPath, PathSchema } from "./path";

export const PageSchema = z
  .object({
    name: z.string(),
    path: PathSchema,
    //   scope: ScopeSchema.optional(),
    // access: AccessAttributesSchema,
    dashboards: z.array(DashboardSchema),
  })
  .strict();

export type Page = z.infer<typeof PageSchema>;

export const defaultPage: Page = {
  name: "example",
  path: defaultPath,
  // access: defaultAccessAttributes,
  dashboards: [defaultDashboard, defaultDatabaseView],
};
