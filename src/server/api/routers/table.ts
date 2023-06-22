import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { type Table, TableSchema } from "@/data/table";
import { ColumnSchema } from "@/data/table/column";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { createTable, getProjectTableDeep } from "../helpers/table";

export const tablesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ projectName: z.string(), tableName: z.string() }))
    .output(z.string())
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          name: input.projectName,
          owner: ctx.session.user,
        },
      });
      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      return await createTable(project.id);
    }),

  listAll: protectedProcedure
    .input(z.string())
    .output(z.array(TableSchema.pick({ id: true, name: true })))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          name: input,
          ownerId: ctx.session.user.id,
        },
        select: {
          tables: {
            select: {
              id: true,
              name: true,
            },
            orderBy: {
              updatedAt: "desc",
            },
          },
        },
      });
      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      return project.tables;
    }),

  get: protectedProcedure
    .input(z.object({ projectName: z.string(), tableName: z.string() }))
    .output(TableSchema)
    .query(async ({ ctx, input }) => {
      const project = await getProjectTableDeep(
        input.projectName,
        input.tableName,
        ctx.session.user.id
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
});
