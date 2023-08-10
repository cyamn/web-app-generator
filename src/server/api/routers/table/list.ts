import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "@/server/api/trpc";

export const INPUT = z.string();

export const OUTPUT = z.array(z.object({ id: z.string(), name: z.string() }));

export const LIST = protectedProcedure
  .input(INPUT)
  .output(OUTPUT)
  .query(async ({ ctx, input }) => {
    const tables = await ctx.prisma.table.findMany({
      where: {
        project: {
          owner: ctx.session.user,
          id: input,
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    if (tables === null) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found",
      });
    }
    return tables;
  });
