import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

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
        },
      });
      return project;
    }),
});
