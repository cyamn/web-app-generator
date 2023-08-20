import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const adminRouter = createTRPCRouter({
  ping: publicProcedure
    .meta({
      openapi: { tags: ["debug"], method: "POST", path: "/debug/ping" },
    })
    .input(z.object({ message: z.string() }))
    .output(z.object({ message: z.string() }))
    .query(({ input }) => ({ message: input.message })),
});
