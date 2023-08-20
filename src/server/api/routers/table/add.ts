import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { defaultTable } from "@/data/table";
import { protectedProcedure } from "@/server/api/trpc";

import { createTable } from "./shared/table";

export const INPUT = z.object({
  project: z.string(),
  tableName: z.string(),
});

export const OUTPUT = z.string();

export const ADD = protectedProcedure
  .meta({ openapi: { method: "POST", path: "/table/add" } })
  .input(INPUT)
  .output(OUTPUT)
  .mutation(async ({ ctx, input }) => {
    const project = await ctx.prisma.project.findFirst({
      where: {
        id: input.project,
        owner: ctx.session.user,
      },
    });
    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found",
      });
    }
    const tableSchema = defaultTable;
    tableSchema.name = input.tableName;
    return await createTable(project.id, tableSchema);
  });
