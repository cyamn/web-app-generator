import { createTRPCRouter } from "@/server/api/trpc";

import { pagesRouter } from "./routers/page";
import { projectsRouter } from "./routers/project";
import { tablesRouter } from "./routers/table";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  projects: projectsRouter,
  pages: pagesRouter,
  tables: tablesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
