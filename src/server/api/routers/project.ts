import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { defaultWebApp } from "@/data/webapp";
import { PageSchema, defaultPage, type Page } from "@/data/page";
import { PathSchema } from "@/data/page/path";
import { AccessAttributesSchema } from "@/data/page/access-attributes";
import { DashboardSchema } from "@/data/dashboard/library/dashboard";
import { TRPCError } from "@trpc/server";

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
                path: JSON.stringify(defaultPage.path),
                dashboards: JSON.stringify(defaultPage.dashboards),
              },
            ],
          },
        },
      });
      return project;
    }),

  getPageOfProject: protectedProcedure
    .input(z.object({ projectName: z.string(), pageName: z.string() }))
    .output(PageSchema)
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          name: input.projectName,
          ownerId: ctx.session.user.id,
        },
        select: {
          pages: {
            where: {
              name: input.pageName,
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
      const unsafePath: unknown = JSON.parse(page.path as string);
      const unsafeDashboards: unknown = JSON.parse(page.dashboards as string);

      const parsedPath = PathSchema.safeParse(unsafePath);
      const parsedDashboards = z
        .array(DashboardSchema)
        .safeParse(unsafeDashboards);

      if (!parsedPath.success || !parsedDashboards.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to parse page",
        });
      }
      return {
        name: page.name,
        path: parsedPath.data,
        dashboards: parsedDashboards.data,
      };
    }),
});
