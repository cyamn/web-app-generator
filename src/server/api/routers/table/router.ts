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
import { get, getAll } from "./get";
import { listTables } from "./list";
import { rowRouter } from "./row/router";
import { TableSchema } from "./schema";

export const tablesRouter = createTRPCRouter({
  get: publicProcedure
    .meta({ openapi: { tags: ["table"], method: "GET", path: "/table" } })
    .input(projectTableColumnSchema)
    .output(TableSchema)
    .query(async ({ input }) => {
      const table = await get(input.tableName, input.project, input.columns);
      if (!table) throw new NotFoundError("table");
      const desirialized = deserialize(table);
      if (input.filter !== undefined) return filter(desirialized, input.filter);
      return desirialized;
    }),
  add: protectedProcedure
    .meta({ openapi: { tags: ["table"], method: "POST", path: "/table" } })
    .input(projectTableSchema)
    .output(z.string())
    .mutation(async ({ ctx, input }) => {
      return await addTable(
        ctx.session.user.id,
        input.project,
        input.tableName
      );
    }),
  delete: protectedProcedure
    .meta({ openapi: { tags: ["table"], method: "DELETE", path: "/table" } })
    .input(projectTableSchema)
    .output(z.string())
    .mutation(async ({ input }) => {
      return await deleteTable(input.tableName, input.project);
    }),
  list: protectedProcedure
    .meta({ openapi: { tags: ["table"], method: "GET", path: "/table/list" } })
    .input(projectIDSchema)
    .output(idListSchema)
    .query(async ({ ctx, input }) => {
      return await listTables(ctx.session.user.id, input.project);
    }),
  getAll: publicProcedure
    .meta({ openapi: { tags: ["table"], method: "GET", path: "/table/all" } })
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
