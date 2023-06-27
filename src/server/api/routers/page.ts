import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { DashboardSchema } from "@/data/dashboard/library/dashboard";
import { defaultPage, PageSchema } from "@/data/page";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { nameToInternal } from "@/utils/name-to-internal";

export const pagesRouter = createTRPCRouter({
  listAll: protectedProcedure
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

  getAll: protectedProcedure
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

  get: protectedProcedure
    .input(z.object({ project: z.string(), page: z.string() }))
    .output(z.object({ page: PageSchema, updatedAt: z.date() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          name: input.project,
          ownerId: ctx.session.user.id,
        },
        select: {
          pages: {
            where: {
              path: {
                equals: input.page,
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

  add: protectedProcedure
    .input(z.object({ project: z.string(), pageName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          name: input.project,
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

  update: protectedProcedure
    .input(
      z.object({
        project: z.string(),
        pagePath: z.string(),
        page: PageSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          name: input.project,
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
      if (project.pages.length === 0 || !project.pages[0]) {
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
});
