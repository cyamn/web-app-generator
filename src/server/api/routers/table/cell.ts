import { z } from "zod";

import { publicProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/database";

import { set } from "./shared/table/cell";

export const INPUT = z.object({
  id: z.string(),
  value: z.string(),
});

export const OUTPUT = z.object({
  id: z.string(),
  value: z.string(),
});

export const SET_CELL = publicProcedure
  .input(INPUT)
  .output(OUTPUT)
  .mutation(async ({ input }) => {
    return set(input.id, input.value);
  });

export const CREATE_CELL_INPUT = z.object({
  col: z.string(),
  row: z.string(),
  value: z.string(),
});

export const CREATE_CELL = publicProcedure
  .input(CREATE_CELL_INPUT)
  .output(OUTPUT)
  .mutation(async ({ input }) => {
    const cell = await prisma.cell.create({
      data: {
        value: input.value,
        column: {
          connect: {
            id: input.col,
          },
        },
        row: {
          connect: {
            id: input.row,
          },
        },
      },
    });
    return cell;
  });
