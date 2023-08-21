import { NotFoundError } from "@prisma/client/runtime";
import { z } from "zod";

import { RowSchema } from "@/data/table/row";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { projectTableSchema } from "../../parameter-schemas";
import { get } from "../get";
import { addRow } from "./add";

export const rowRouter = createTRPCRouter({
  add: publicProcedure
    .meta({
      openapi: { tags: ["table"], method: "POST", path: "/table/row" },
    })
    .input(
      z.object({
        ...projectTableSchema.shape,
        row: RowSchema,
      })
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      const table = await get(input.tableName, input.project);
      if (!table) throw new NotFoundError("table");
      return await addRow(table, input.row);
    }),
});
