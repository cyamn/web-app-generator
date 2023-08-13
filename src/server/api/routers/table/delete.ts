import { z } from "zod";

import { publicProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/database";

import { InternalError } from "../shared/errors";

export const INPUT = z.object({
  table: z.string(),
  project: z.string(),
});

export const DELETE = publicProcedure
  .input(INPUT)
  .mutation(async ({ input }) => {
    const toDelete = await prisma.table.findFirst({
      where: {
        name: input.table,
        projectId: input.project,
      },
    });
    if (!toDelete) return new InternalError("Failed to delete table");
    await prisma.table.delete({
      where: {
        id: toDelete.id,
      },
    });
    return true;
  });
