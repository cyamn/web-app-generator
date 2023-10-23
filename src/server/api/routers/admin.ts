import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const adminRouter = createTRPCRouter({
  status: publicProcedure
    .meta({
      openapi: {
        description: "Get the status of the server",
        tags: ["debug"],
        method: "GET",
        path: "/debug/status",
      },
    })
    .input(z.object({}))
    .output(z.object({ status: z.string() }))
    .query(() => ({ status: "ok" })),

  ping: publicProcedure
    .meta({
      openapi: {
        description: "Ping a message back to the client",
        tags: ["debug"],
        method: "POST",
        path: "/debug/ping",
      },
    })
    .input(z.object({ message: z.string() }))
    .output(z.object({ message: z.string() }))
    .query(({ input }) => ({ message: input.message })),
});
