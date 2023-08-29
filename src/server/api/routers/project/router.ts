import { z } from "zod";

import { createTRPCRouter } from "@/server/api/trpc";
import { protectedProcedure } from "@/server/api/trpc";

import { addProject } from "./add";
import { getProject } from "./get";
import { listProjects } from "./list";

export const projectsRouter = createTRPCRouter({
  add: protectedProcedure
    .meta({
      openapi: { tags: ["project"], method: "POST", path: "/project" },
    })
    .input(z.object({ name: z.string() }))
    .output(z.string())
    .mutation(async ({ ctx, input }) => {
      return await addProject(input.name, ctx.session.user.id);
    }),

  get: protectedProcedure
    .meta({
      openapi: { tags: ["project"], method: "GET", path: "/project" },
    })
    .input(z.object({ id: z.string() }))
    .output(
      z.object({
        name: z.string(),
        id: z.string(),
        createdAt: z.date(),
        description: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await getProject(input.id);
    }),

  update: protectedProcedure
    .meta({
      openapi: { tags: ["project"], method: "PATCH", path: "/project" },
    })
    .input(
      z.object({
        id: z.string(),
        data: z
          .object({
            name: z.string().optional(),
            description: z.string().optional(),
          })
          .nonstrict(),
      })
    )
    .output(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.project.update({
        where: {
          id: input.id,
        },
        data: input.data,
      });
      return input.id;
    }),

  list: protectedProcedure
    .meta({
      openapi: { tags: ["project"], method: "GET", path: "/project/list" },
    })
    .input(z.object({}))
    .output(
      z.array(
        z.object({
          name: z.string(),
          id: z.string(),
          updatedAt: z.date(),
          description: z.string(),
        })
      )
    )
    .query(async ({ ctx }) => {
      return await listProjects(ctx.session.user.id);
    }),
});
