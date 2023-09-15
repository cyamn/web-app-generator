import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { addCell } from "./add";
import { updateCell } from "./update";

export const cellRouter = createTRPCRouter({
  add: publicProcedure
    .meta({
      openapi: { tags: ["table"], method: "POST", path: "/table/cell" },
    })
    .input(
      z.object({
        column: z.string(),
        row: z.string(),
        value: z.string(),
      })
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      return await addCell(input.column, input.row, input.value);
    }),

  update: publicProcedure
    .meta({
      openapi: { tags: ["table"], method: "PATCH", path: "/table/cell" },
    })
    .input(
      z.object({
        cellID: z.string(),
        value: z.string(),
      })
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      return await updateCell(input.cellID, input.value);
    }),
});
