import { appRouter } from "@/server/api/root";

import prisma from "./prisma";

export const publicCaller = appRouter.createCaller({
  session: null,
  prisma: prisma,
});

export const adminCaller = appRouter.createCaller({
  session: {
    user: { id: "test" },
    expires: new Date().toISOString(),
  },
  prisma: prisma,
});
