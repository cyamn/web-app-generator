import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { defaultWebApp } from "@/data/webapp";
import { PageSchema, defaultPage } from "@/data/page";
import { DashboardSchema } from "@/data/dashboard/library/dashboard";
import { TRPCError } from "@trpc/server";
import { nameToInternal } from "@/utils/name-to-internal";
import { z } from "zod";
import { defaultTable, type Table, TableSchema } from "@/data/table";
import { RowSchema, type Row } from "@/data/table/row";
import cuid from "cuid";
import { ColumnSchema } from "@/data/table/column";

export const projectsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.project.findMany({
      select: {
        name: true,
        updatedAt: true,
        description: true,
      },
      where: {
        ownerId: ctx.session.user.id,
      },
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
    });
  }),
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.create({
        data: {
          name: input.name,
          ownerId: ctx.session.user.id,
          description: "my amazing project",
          home: defaultWebApp.home,
          pages: {
            create: [
              {
                name: defaultPage.name,
                path: defaultPage.path,
                dashboards: JSON.stringify(defaultPage.dashboards),
              },
            ],
          },
        },
      });
      // create table
      const table = await ctx.prisma.table.create({
        data: {
          name: "people",
          projectId: project.id,
        },
      });
      // create default columns
      // create a dictionary: column key -> cuid
      // later we can retrieve the cui for "name" by doing "columnCuids['name']
      const columnCuids: Record<string, string> = {};
      for (const column of defaultTable.columns) {
        columnCuids[column.key] = cuid();
      }
      const defaultColumns = await ctx.prisma.column.createMany({
        data: defaultTable.columns.map((column, index) => ({
          id: columnCuids[column.key],
          key: column.key,
          type: column.type,
          tableId: table.id,
        })),
      });
      // create default rows
      const rowCuids = defaultTable.rows.map(() => cuid());
      const defaultRows = await ctx.prisma.row.createMany({
        data: defaultTable.rows.map((_, index) => ({
          id: rowCuids[index],
          tableId: table.id,
        })),
      });
      // create default cells
      const defaultCells = await ctx.prisma.cell.createMany({
        data: defaultTable.rows
          .map((row: Row, rowIndex) =>
            Object.keys(row).map((key, columnIndex) => ({
              rowId: rowCuids[rowIndex]!,
              columnId: columnCuids[key]!,
              value: row[key]?.toString() ?? "",
            }))
          )
          .flat(),
      });

      // return table.id;
      return project;
    }),

  listAllPagesOfProject: protectedProcedure
    .input(z.string())
    .output(z.array(PageSchema.pick({ name: true, path: true })))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          name: input,
          ownerId: ctx.session.user.id,
        },
        select: {
          pages: {
            select: {
              name: true,
              path: true,
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
      return project.pages;
    }),

  getAllPagesOfProject: protectedProcedure
    .input(z.string())
    .output(z.array(z.object({ page: PageSchema, updatedAt: z.date() })))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          name: input,
          ownerId: ctx.session.user.id,
        },
        select: {
          pages: {
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
      const pages = project.pages.map((page) => {
        const unsafeDashboards: unknown = JSON.parse(page.dashboards as string);

        const parsedDashboards = z
          .array(DashboardSchema)
          .safeParse(unsafeDashboards);

        if (!parsedDashboards.success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to parse page",
          });
        }
        return {
          page: {
            name: page.name,
            path: page.path,
            dashboards: parsedDashboards.data,
          },
          updatedAt: page.updatedAt,
        };
      });
      return pages;
    }),

  getPageOfProject: protectedProcedure
    .input(z.object({ projectName: z.string(), pagePath: z.string() }))
    .output(z.object({ page: PageSchema, updatedAt: z.date() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          name: input.projectName,
          ownerId: ctx.session.user.id,
        },
        select: {
          pages: {
            where: {
              path: {
                equals: input.pagePath,
              },
            },
          },
        },
      });
      if (!project || project.pages.length === 0 || !project.pages[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Page not found",
        });
      }
      const page = project.pages[0];
      const unsafeDashboards: unknown = JSON.parse(page.dashboards as string);

      const parsedDashboards = z
        .array(DashboardSchema)
        .safeParse(unsafeDashboards);

      if (!parsedDashboards.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to parse page",
        });
      }
      return {
        page: {
          name: page.name,
          path: page.path,
          dashboards: parsedDashboards.data,
        },
        updatedAt: page.updatedAt,
      };
    }),

  addPageToProject: protectedProcedure
    .input(z.object({ projectName: z.string(), pageName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          name: input.projectName,
          ownerId: ctx.session.user.id,
        },
      });
      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      const page = await ctx.prisma.page.create({
        data: {
          name: input.pageName,
          path: nameToInternal(input.pageName),
          dashboards: JSON.stringify(defaultPage.dashboards),
          projectId: project.id,
        },
      });
      return page;
    }),

  updatePageOfProject: protectedProcedure
    .input(
      z.object({
        projectName: z.string(),
        pagePath: z.string(),
        page: PageSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          name: input.projectName,
          ownerId: ctx.session.user.id,
        },
        select: {
          pages: {
            where: {
              path: {
                equals: input.pagePath,
              },
            },
            select: {
              id: true,
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
      if (!project.pages || project.pages.length === 0 || !project.pages[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Page not found",
        });
      }
      const page = await ctx.prisma.page.update({
        where: {
          id: project.pages[0].id,
        },
        data: {
          name: input.page.name,
          path: input.page.path,
          dashboards: JSON.stringify(input.page.dashboards),
        },
      });

      return page;
    }),

  createTable: protectedProcedure
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
      // create table
      const table = await ctx.prisma.table.create({
        data: {
          name: "people",
          projectId: project.id,
        },
      });
      // create default columns
      // create a dictionary: column key -> cuid
      // later we can retrieve the cui for "name" by doing "columnCuids['name']
      const columnCuids: Record<string, string> = {};
      for (const column of defaultTable.columns) {
        columnCuids[column.key] = cuid();
      }
      const defaultColumns = await ctx.prisma.column.createMany({
        data: defaultTable.columns.map((column, index) => ({
          id: columnCuids[column.key],
          key: column.key,
          type: column.type,
          tableId: table.id,
        })),
      });
      // create default rows
      const rowCuids = defaultTable.rows.map(() => cuid());
      const defaultRows = await ctx.prisma.row.createMany({
        data: defaultTable.rows.map((_, index) => ({
          id: rowCuids[index],
          tableId: table.id,
        })),
      });
      // create default cells
      const defaultCells = await ctx.prisma.cell.createMany({
        data: defaultTable.rows
          .map((row: Row, rowIndex) =>
            Object.keys(row).map((key, columnIndex) => ({
              rowId: rowCuids[rowIndex]!,
              columnId: columnCuids[key]!,
              value: row[key]?.toString() ?? "",
            }))
          )
          .flat(),
      });

      return table.id;
    }),

  listTablesOfProject: protectedProcedure
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

  getTableOfProject: protectedProcedure
    .input(z.object({ projectName: z.string(), tableName: z.string() }))
    .output(TableSchema)
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          name: input.projectName,
          ownerId: ctx.session.user.id,
        },
        select: {
          tables: {
            where: {
              name: {
                equals: input.tableName,
              },
            },
            select: {
              id: true,
              name: true,
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
          },
        },
      });
      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      if (
        !project.tables ||
        project.tables.length === 0 ||
        !project.tables[0]
      ) {
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
          row.cells.forEach((cell) => {
            const { value, column } = cell;
            const { key } = column;
            result[key] = value;
          });
          return result;
        }),
      };
      return outputTable;
    }),
});
