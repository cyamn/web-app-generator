import { z } from "zod";

import { RowSchema } from "@/data/table/row";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { protectedProcedure } from "@/server/api/trpc";

import {
  CSVDataSchema,
  idListSchema,
  projectIDSchema,
  projectTableColumnSchema,
  projectTableSchema,
} from "../parameter-schemas";
import { NotFoundError } from "../shared/errors";
import { addTable } from "./add";
import { addCell } from "./cell/add";
import { updateCell } from "./cell/update";
import { createColumn } from "./column/add";
import { updateColumn } from "./column/update";
import { importCSV } from "./data/import";
import { deserialize, deserializeCSV } from "./data/serialization";
import { deleteTable } from "./delete";
import { get, getAll } from "./get";
import { listTables } from "./list";
import { addRow } from "./row/add";
import { TableSchema } from "./schema";

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
});

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

export const dataRouter = createTRPCRouter({
  exportCSV: publicProcedure
    .meta({
      openapi: { tags: ["table"], method: "GET", path: "/table/export/csv" },
    })
    .input(projectTableColumnSchema)
    .output(CSVDataSchema)
    .mutation(async ({ input }) => {
      const table = await get(input.tableName, input.project, input.columns);
      if (!table) throw new NotFoundError("table");
      return {
        csv: deserializeCSV(table),
        name: table.name,
      };
    }),
  importCSV: publicProcedure
    .meta({
      openapi: { tags: ["table"], method: "POST", path: "/table/import/csv" },
    })
    .input(
      z.object({
        csv: z.string(),
        name: z.string(),
        project: z.string(),
        table: z.string().optional(),
      })
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      return await importCSV(input.project, input.csv, input.name, input.table);
    }),
});

export const tablesRouter = createTRPCRouter({
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
  list: protectedProcedure
    .meta({ openapi: { tags: ["table"], method: "GET", path: "/table/list" } })
    .input(projectIDSchema)
    .output(idListSchema)
    .query(async ({ ctx, input }) => {
      return await listTables(ctx.session.user.id, input.project);
    }),
  get: publicProcedure
    .meta({ openapi: { tags: ["table"], method: "GET", path: "/table" } })
    .input(projectTableColumnSchema)
    .output(TableSchema)
    .query(async ({ input }) => {
      const table = await get(input.tableName, input.project, input.columns);
      if (!table) throw new NotFoundError("table");
      return deserialize(table);
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
  delete: protectedProcedure
    .meta({ openapi: { tags: ["table"], method: "DELETE", path: "/table" } })
    .input(projectTableSchema)
    .output(z.string())
    .mutation(async ({ input }) => {
      return await deleteTable(input.tableName, input.project);
    }),
  row: rowRouter,
  column: columnRouter,
  cell: cellRouter,
  data: dataRouter,
});
