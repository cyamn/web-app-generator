import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const settingsRouter = createTRPCRouter({
  setPagePublic: protectedProcedure
    .input(
      z.object({ project: z.string(), pagePath: z.string(), public: z.boolean() })
    )
    .mutation(async ({ ctx, input }) => {
      const id = await ctx.prisma.page.findFirst({
        where: {
          path: input.pagePath,
          project: {
            name: input.project,
            ownerId: ctx.session.user.id,
          },
        },
        select: {
          id: true,
        },
      });
      if (id === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Page not found",
        });
      }
      const page = await ctx.prisma.page.update({
        where: {
          id: id.id,
        },
        data: {
          public: input.public,
        },
      });

      if (page === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Page not found",
        });
      }
      return id.id;
    }),
});
