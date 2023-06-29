import { TRPCError } from "@trpc/server";
import cuid from "cuid";
import { z } from "zod";

import { defaultTable, type Table, TableSchema } from "@/data/table";
import { ColumnSchema } from "@/data/table/column";
import { RowSchema } from "@/data/table/row";
import { Dict } from "@/data/types";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

import { buildCells, createTable, getProjectTableDeep } from "../helpers/table";

export const tablesRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object({ project: z.string(), tableName: z.string() }))
    .output(z.string())
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          id: input.project,
          owner: ctx.session.user,
        },
      });
      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      const tableSchema = defaultTable;
      tableSchema.name = input.tableName;
      return await createTable(project.id, tableSchema);
    }),

  listAll: protectedProcedure
    .input(z.string())
    .output(z.array(z.object({ id: z.string(), name: z.string() })))
    .query(async ({ ctx, input }) => {
      const tables = await ctx.prisma.table.findMany({
        where: {
          project: {
            owner: ctx.session.user,
            name: input,
          },
        },
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      if (tables === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      return tables;
    }),

  getAll: protectedProcedure
    .input(z.string())
    .output(z.array(z.object({ table: TableSchema, updatedAt: z.date() })))
    .query(async ({ ctx, input }) => {
      const tables = await ctx.prisma.table.findMany({
        where: {
          project: {
            owner: ctx.session.user,
            name: input,
          },
        },
        select: {
          id: true,
          name: true,
          updatedAt: true,
          columns: {
            select: {
              id: true,
              key: true,
              type: true,
            },
          },
          rows: {
            select: {
              id: true,
              cells: {
                select: {
                  column: {
                    select: {
                      key: true,
                    },
                  },
                  value: true,
                },
              },
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      if (tables === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      return tables.map((table) => {
        const outputTable: Table = {
          name: table.name,
          columns: table.columns.map((column) => {
            const col = ColumnSchema.safeParse({
              type: column.type,
              key: column.key,
            });
            if (!col.success) {
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Invalid column",
              });
            }
            return col.data;
          }),
          rows: table.rows.map((row) => {
            const result: { [key: string]: string } = {};
            for (const cell of row.cells) {
              const { value, column } = cell;
              const { key } = column;
              result[key] = value;
            }
            return result;
          }),
        };
        return {
          table: outputTable,
          updatedAt: table.updatedAt,
        };
      });
    }),

  get: publicProcedure
    .input(
      z.object({
        projectName: z.string(),
        tableName: z.string(),
        columns: z.array(z.string()).optional(),
      })
    )
    .output(TableSchema)
    .query(async ({ ctx, input }) => {
      const project = await getProjectTableDeep(
        input.projectName,
        input.tableName,
        input.columns
      );
      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      if (project.tables.length === 0 || !project.tables[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Table not found",
        });
      }
      const table = project.tables[0];
      const outputTable: Table = {
        name: table.name,
        columns: table.columns.map((column) => {
          const col = ColumnSchema.safeParse({
            type: column.type,
            key: column.key,
          });
          if (!col.success) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Invalid column",
            });
          }
          return col.data;
        }),
        rows: table.rows.map((row) => {
          const result: { [key: string]: string } = {};
          for (const cell of row.cells) {
            const { value, column } = cell;
            const { key } = column;
            result[key] = value;
          }
          return result;
        }),
      };
      return outputTable;
    }),

  insert: publicProcedure
    .input(
      z.object({
        projectName: z.string(),
        tableName: z.string(),
        row: RowSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const InputRow = input.row;
      const project = await getProjectTableDeep(
        input.projectName,
        input.tableName
      );
      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      if (project.tables.length === 0 || !project.tables[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Table not found",
        });
      }
      const table = project.tables[0];
      const rowID = cuid();
      const row = await ctx.prisma.row.create({
        data: {
          id: rowID,
          table: {
            connect: {
              id: table.id,
            },
          },
        },
      });
      // get ids for each column
      const columnCuids: Dict = {};
      for (const column of table.columns) {
        const col = await ctx.prisma.column.findFirst({
          where: {
            table: {
              id: table.id,
            },
            key: column.key,
          },
          select: {
            id: true,
          },
        });
        if (!col) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Column not found",
          });
        }
        columnCuids[column.key] = col.id;
      }
      await buildCells([InputRow], columnCuids, [rowID]);
      return;
    }),
});
