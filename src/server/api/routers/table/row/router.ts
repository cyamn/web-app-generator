import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { RowSchema } from "@/data/table/row";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { projectTableSchema, TableFilterSchema } from "../../parameter-schemas";
import { NotFoundError } from "../../shared/errors";
import { checkFilters } from "../data/filter";
import { get } from "../get";
import { addRow } from "./add";
import { deleteRow } from "./delete";

export const rowRouter = createTRPCRouter({
  add: publicProcedure
    .meta({
      openapi: { tags: ["table"], method: "POST", path: "/table/row" },
    })
    .input(
      z.object({
        ...projectTableSchema.shape,
        filter: TableFilterSchema.optional(),
        row: RowSchema,
      })
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      if (checkFilters(input.row, input.filter ?? [])) {
        const table = await get(input.tableName, input.project);
        if (!table) throw new NotFoundError("table");
        return await addRow(table, input.row);
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Data did not pass the filter",
        });
      }
    }),

  delete: publicProcedure
    .meta({
      openapi: { tags: ["table"], method: "DELETE", path: "/table/row" },
    })
    .input(
      z.object({
        ...projectTableSchema.shape,
        rowId: z.string(),
      })
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      const table = await get(input.tableName, input.project);
      if (!table) throw new NotFoundError("table");
      return await deleteRow(table, input.rowId);
    }),
});
