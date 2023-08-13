import { z } from "zod";

import { publicProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/database";

export const INPUT = z.object({
  id: z.string(),
  key: z.string(),
  type: z.string(),
});

export const SET_COLUMN = publicProcedure
  .input(INPUT)
  .mutation(async ({ input }) => {
    const updated = await prisma.column.update({
      where: {
        id: input.id,
      },
      data: {
        key: input.key,
        type: input.type,
      },
    });
    return updated;
  });

export const ADD_INPUT = z.object({
  table: z.string(),
  key: z.string(),
  type: z.string().default("string"),
});

export const ADD_COLUMN = publicProcedure
  .input(ADD_INPUT)
  .mutation(async ({ input }) => {
    const added = await prisma.column.create({
      data: {
        key: input.key,
        type: input.type,
        table: {
          connect: {
            id: input.table,
          },
        },
      },
    });
    return added;
  });
