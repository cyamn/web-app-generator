import { z } from "zod";

import { publicProcedure } from "@/server/api/trpc";

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
