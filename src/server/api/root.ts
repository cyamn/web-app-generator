import { createTRPCRouter } from "@/server/api/trpc";

import { adminRouter } from "./routers/admin";
import { pageRouter } from "./routers/page/router";
import { projectsRouter } from "./routers/project";
import { rolesRouter } from "./routers/roles";
import { settingsRouter } from "./routers/settings";
import { tablesRouter } from "./routers/table/router";
import { variablesRouter } from "./routers/variables/router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  projects: projectsRouter,
  pages: pageRouter,
  tables: tablesRouter,
  settings: settingsRouter,
  roles: rolesRouter,
  admin: adminRouter,
  variables: variablesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
