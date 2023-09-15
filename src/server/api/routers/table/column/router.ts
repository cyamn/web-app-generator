import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/database";

import { createColumn } from "./add";
import { updateColumn } from "./update";

export const columnRouter = createTRPCRouter({
  add: publicProcedure
    .meta({
      openapi: { tags: ["table"], method: "POST", path: "/table/column" },
    })
    .input(
      z.object({
        tableID: z.string(),
        key: z.string(),
        type: z.string(),
      })
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      return await createColumn(input.tableID, input.key, input.type);
    }),
  update: publicProcedure
    .meta({
      openapi: { tags: ["table"], method: "PATCH", path: "/table/column" },
    })
    .input(
      z.object({
        columnID: z.string(),
        key: z.string(),
        type: z.string(),
      })
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      return await updateColumn(input.columnID, input.key, input.type);
    }),

  delete: publicProcedure
    .meta({
      openapi: { tags: ["table"], method: "DELETE", path: "/table/column" },
    })
    .input(
      z.object({
        columnID: z.string(),
      })
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      await prisma.column.delete({
        where: {
          id: input.columnID,
        },
      });
      return "ok";
    }),
});
