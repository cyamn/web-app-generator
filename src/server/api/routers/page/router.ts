import { z } from "zod";

import { PageSchema } from "@/data/page";
import { VariablesSchema } from "@/data/page/variables";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { protectedProcedure } from "@/server/api/trpc";

import { addPage } from "./add";
import { deletePage } from "./delete";
import { getAllPages, getPage, getPublicPage } from "./get";
import { listPages } from "./list";
import { updatePage } from "./update";

export const pageRouter = createTRPCRouter({
  get: publicProcedure
    .meta({
      openapi: { tags: ["page"], method: "GET", path: "/page" },
    })
    .input(
      z.object({
        project: z.string(),
        page: z.string(),
      })
    )
    .output(
      z.object({
        page: PageSchema,
        variables: VariablesSchema,
        updatedAt: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session?.user) {
        return await getPage(ctx.session.user.id, input.project, input.page);
      }
      return await getPublicPage(input.project, input.page);
    }),

  add: protectedProcedure
    .meta({
      openapi: { tags: ["page"], method: "POST", path: "/page" },
    })
    .input(z.object({ project: z.string(), pageName: z.string() }))
    .output(z.string())
    .mutation(async ({ ctx, input }) => {
      return await addPage(ctx.session.user.id, input.project, input.pageName);
    }),

  update: protectedProcedure
    .meta({
      openapi: { tags: ["page"], method: "PATCH", path: "/page" },
    })
    .input(
      z.object({
        project: z.string(),
        page: PageSchema,
      })
    )
    .output(z.string())
    .mutation(async ({ ctx, input }) => {
      return await updatePage(ctx.session.user.id, input.project, input.page);
    }),

  delete: protectedProcedure
    .meta({
      openapi: { tags: ["page"], method: "DELETE", path: "/page" },
    })
    .input(z.object({ project: z.string(), page: z.string() }))
    .output(z.string())
    .mutation(async ({ ctx, input }) => {
      return await deletePage(ctx.session.user.id, input.project, input.page);
    }),

  list: protectedProcedure
    .meta({
      openapi: { tags: ["page"], method: "GET", path: "/page/list" },
    })
    .input(z.object({ project: z.string() }))
    .output(z.array(PageSchema.pick({ name: true, path: true })))
    .query(async ({ ctx, input }) => {
      return await listPages(ctx.session.user.id, input.project);
    }),

  getAll: protectedProcedure
    .meta({
      openapi: { tags: ["page"], method: "GET", path: "/page/all" },
    })
    .input(z.object({ project: z.string() }))
    .output(z.array(z.object({ page: PageSchema, updatedAt: z.date() })))
    .query(async ({ ctx, input }) => {
      return await getAllPages(ctx.session.user.id, input.project);
    }),
});
