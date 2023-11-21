import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { protectedProcedure } from "@/server/api/trpc";

import {
  idListSchema,
  projectIDSchema,
  projectTableColumnSchema,
  projectTableSchema,
} from "../parameter-schemas";
import { NotFoundError } from "../shared/errors";
import { addTable } from "./add";
import { cellRouter } from "./cell/router";
import { columnRouter } from "./column/router";
import { filter } from "./data/filter";
import { dataRouter } from "./data/router";
import { deserialize } from "./data/serialization";
import { deleteTable } from "./delete";
import { getAll, getTable } from "./get";
import { listTables } from "./list";
import { rowRouter } from "./row/router";
import { TableSchema } from "./schema";
import { updateTable } from "./update";

export const tablesRouter = createTRPCRouter({
  get: publicProcedure
    .meta({
      openapi: {
        description: "Get a table from a project",
        tags: ["table"],
        method: "GET",
        path: "/table",
      },
    })
    .input(projectTableColumnSchema)
    .output(TableSchema)
    .query(async ({ input }) => {
      const table = await getTable(
        input.tableName,
        input.project,
        input.columns,
      );
      if (!table) throw new NotFoundError("table");
      const deserialized = deserialize(table);
      if (input.filter !== undefined) return filter(deserialized, input.filter);
      return deserialized;
    }),
  add: protectedProcedure
    .meta({
      openapi: {
        description: "Add a table to a project",
        tags: ["table"],
        method: "POST",
        path: "/table",
      },
    })
    .input(projectTableSchema)
    .output(z.string())
    .mutation(async ({ ctx, input }) => {
      return await addTable(
        ctx.session.user.id,
        input.project,
        input.tableName,
      );
    }),

  update: protectedProcedure
    .meta({
      openapi: {
        description: "Update a table in a project",
        tags: ["table"],
        method: "PATCH",
        path: "/table",
      },
    })
    .input(
      z.object({
        project: z.string(),
        tableName: z.string(),
        newName: z.string(),
        columns: z.record(z.string()),
        data: z.array(z.array(z.string())),
      }),
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      return await updateTable(
        input.project,
        input.tableName,
        input.columns,
        input.data,
        input.newName,
      );
    }),

  delete: protectedProcedure
    .meta({
      openapi: {
        description: "Delete a table in a project",
        tags: ["table"],
        method: "DELETE",
        path: "/table",
      },
    })
    .input(projectTableSchema)
    .output(z.string())
    .mutation(async ({ input }) => {
      return await deleteTable(input.tableName, input.project);
    }),

  list: protectedProcedure
    .meta({
      openapi: {
        description: "List all tables in a project",
        tags: ["table"],
        method: "GET",
        path: "/table/list",
      },
    })
    .input(projectIDSchema)
    .output(idListSchema)
    .query(async ({ ctx, input }) => {
      return await listTables(ctx.session.user.id, input.project);
    }),
  getAll: publicProcedure
    .meta({
      openapi: {
        description: "Get all tables in a project",
        tags: ["table"],
        method: "GET",
        path: "/table/all",
      },
    })
    .input(projectIDSchema)
    .output(z.array(z.object({ table: TableSchema, updatedAt: z.date() })))
    .query(async ({ input }) => {
      const tables = await getAll(input.project);
      if (tables === null) throw new NotFoundError("Tables");
      return tables.map((table) => {
        return {
          table: deserialize(table),
          updatedAt: table.updatedAt,
        };
      });
    }),
  row: rowRouter,
  column: columnRouter,
  cell: cellRouter,
  data: dataRouter,
});
