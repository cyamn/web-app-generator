import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const rolesRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        project: z.string(),
        role: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const role = await ctx.prisma.role.create({
        data: {
          name: input.role,
          project: {
            connect: {
              id: input.project,
            },
          },
        },
      });
      return role.id;
    }),

  list: protectedProcedure
    .input(
      z.object({
        project: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const roles = await ctx.prisma.role.findMany({
        where: {
          project: {
            id: input.project,
          },
        },
        select: {
          id: true,
          name: true,
          users: true,
          rules: true,
        },
      });
      return roles;
    }),

  addUser: protectedProcedure
    .input(
      z.object({
        project: z.string(),
        role: z.string(),
        email: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      const role = await ctx.prisma.role.findUnique({
        where: {
          id: input.role,
        },
      });
      if (!role) {
        throw new Error("Role not found");
      }
      const updatedRole = await ctx.prisma.role.update({
        where: {
          id: input.role,
        },
        data: {
          users: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      return updatedRole.id;
    }),
});
