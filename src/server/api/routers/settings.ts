import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const settingsRouter = createTRPCRouter({
  setPagePublic: protectedProcedure
    .input(
      z.object({
        project: z.string(),
        pagePath: z.string(),
        public: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const pages = await ctx.prisma.page.updateMany({
        where: {
          path: input.pagePath,
          project: {
            id: input.project,
            ownerId: ctx.session.user.id,
          },
        },
        data: {
          public: input.public,
        },
      });

      if (pages === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Page not found",
        });
      }
      return pages;
    }),

  getPageRoleAccess: protectedProcedure
    .input(
      z.object({
        project: z.string(),
        page: z.string(),
      })
    )
    .output(
      z.array(
        z.object({
          name: z.string(),
          id: z.string(),
          access: z.boolean(),
          users: z.array(
            z.object({
              id: z.string(),
              name: z.string().nullable(),
              image: z.string().nullable(),
            })
          ),
        })
      )
    )
    // eslint-disable-next-line max-lines-per-function
    .query(async ({ ctx, input }) => {
      // get all roles for project
      const roles = await ctx.prisma.role.findMany({
        where: {
          project: {
            id: input.project,
          },
        },
        select: {
          id: true,
          name: true,
          users: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          roleAccessPages: {
            select: {
              page: {
                select: {
                  path: true,
                },
              },
            },
          },
        },
      });
      return roles.map((role) => {
        return {
          name: role.name,
          id: role.id,
          users: role.users,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          access: role.roleAccessPages.some(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            (roleAccessPage) => roleAccessPage.page.path === input.page
          ),
        };
      });
    }),

  setPageRoleAccess: protectedProcedure
    .input(
      z.object({
        project: z.string(),
        page: z.string(),
        role: z.string(),
        access: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const page = await ctx.prisma.page.findFirst({
        where: {
          path: input.page,
          project: {
            id: input.project,
            ownerId: ctx.session.user.id,
          },
        },
        select: {
          id: true,
        },
      });

      if (!page) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Page not found",
        });
      }

      await (input.access
        ? ctx.prisma.roleAccessPage.create({
            data: {
              role: {
                connect: {
                  id: input.role,
                },
              },
              page: {
                connect: {
                  id: page.id,
                },
              },
            },
          })
        : ctx.prisma.roleAccessPage.deleteMany({
            where: {
              page: {
                id: page.id,
              },
              role: {
                id: input.role,
              },
            },
          }));
    }),
});
