import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { RowSchema } from "@/data/table/row";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { projectTableSchema, TableFilterSchema } from "../../parameter-schemas";
import { NotFoundError } from "../../shared/errors";
import { checkFilters } from "../data/filter";
import { getTable } from "../get";
import { addRow } from "./add";
import { deleteRow } from "./delete";
import { updateRow } from "./update";

export const rowRouter = createTRPCRouter({
  add: publicProcedure
    .meta({
      openapi: {
        description: "Add a row to a table",
        tags: ["table"],
        method: "POST",
        path: "/table/row",
      },
    })
    .input(
      z.object({
        ...projectTableSchema.shape,
        filter: TableFilterSchema.optional(),
        row: RowSchema,
      }),
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      if (checkFilters(input.row, input.filter ?? [])) {
        const table = await getTable(input.tableName, input.project);
        if (!table) throw new NotFoundError("table");
        return await addRow(table, input.row);
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Data did not pass the filter",
        });
      }
    }),

  update: publicProcedure
    .meta({
      openapi: {
        description: "Update a row in a table",
        tags: ["table"],
        method: "PATCH",
        path: "/table/row",
      },
    })
    .input(
      z.object({
        rowId: z.string(),
        row: RowSchema,
      }),
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      return await updateRow(input.rowId, input.row);
    }),

  delete: publicProcedure
    .meta({
      openapi: {
        description: "Delete a row from a table",
        tags: ["table"],
        method: "DELETE",
        path: "/table/row",
      },
    })
    .input(
      z.object({
        rowId: z.string(),
      }),
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      return await deleteRow(input.rowId);
    }),
});
