import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { defaultPage } from "@/data/page";
import { defaultWebApp } from "@/data/webapp";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

import { createTable } from "../helpers/table";

export const projectsRouter = createTRPCRouter({
  listAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.project.findMany({
      select: {
        name: true,
        updatedAt: true,
        description: true,
        id: true,
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
      await createTable(project.id);

      // return table.id;
      return project;
    }),

  get: publicProcedure
    .input(z.string())
    .output(z.object({ name: z.string(), id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          id: input,
        },
      });
      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      return project;
    }),
});
