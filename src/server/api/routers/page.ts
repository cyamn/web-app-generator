import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { DashboardSchema } from "@/data/dashboard/library/dashboard";
import { defaultPage, PageSchema } from "@/data/page";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { prisma } from "@/server/database";
import { nameToInternal } from "@/utils/name-to-internal";

export const pagesRouter = createTRPCRouter({
  listAll: protectedProcedure
    .meta({
      openapi: { tags: ["page"], method: "GET", path: "/page/list" },
    })
    .input(z.object({ project: z.string() }))
    .output(z.array(PageSchema.pick({ name: true, path: true })))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          id: input.project,
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
    .meta({
      openapi: { tags: ["page"], method: "GET", path: "/page/get/all" },
    })
    .input(z.object({ project: z.string() }))
    .output(z.array(z.object({ page: PageSchema, updatedAt: z.date() })))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          id: input.project,
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

  //TODO: make not copy of above
  getPublic: publicProcedure
    .meta({
      openapi: { tags: ["page"], method: "GET", path: "/page/get/public" },
    })
    .input(z.object({ project: z.string(), page: z.string() }))
    .output(z.object({ page: PageSchema, updatedAt: z.date() }))
    .query(async ({ input }) => {
      const project = await prisma.project.findFirst({
        where: {
          id: input.project,
        },
        select: {
          pages: {
            where: {
              path: {
                equals: input.page,
              },
              public: {
                equals: true,
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

  get: protectedProcedure
    .meta({
      openapi: { tags: ["page"], method: "GET", path: "/page/get" },
    })
    .input(z.object({ project: z.string(), page: z.string() }))
    .output(z.object({ page: PageSchema, updatedAt: z.date() }))
    .query(async ({ ctx, input }) => {
      const page = await ctx.prisma.page.findFirst({
        where: {
          path: input.page,
          projectId: input.project,
          OR: [
            {
              project: {
                ownerId: ctx.session.user.id,
              },
            },
            {
              public: true,
            },
            {
              canView: {
                some: {
                  role: {
                    users: {
                      some: {
                        id: ctx.session.user.id,
                      },
                    },
                    admin: true,
                  },
                },
              },
            },
          ],
        },
        select: {
          name: true,
          path: true,
          dashboards: true,
          updatedAt: true,
          public: true,
          canView: {
            select: {
              role: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
      if (!page) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Page not found",
        });
      }
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
          access: {
            public: page.public,
            canView: page.canView.map((canView) => canView.role.name),
          },
        },
        updatedAt: page.updatedAt,
      };
    }),

  add: protectedProcedure
    // .meta({
    //   openapi: { tags: ["page"], method: "POST", path: "/page/add" },
    // })
    .input(z.object({ project: z.string(), pageName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          id: input.project,
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
    // .meta({
    //   openapi: { tags: ["page"], method: "PATCH", path: "/page/patch" },
    // })
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
          id: input.project,
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
