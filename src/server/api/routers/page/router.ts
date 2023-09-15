import { z } from "zod";

import { PageSchema } from "@/data/page";
import { VariablesSchema } from "@/data/page/variables";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { protectedProcedure } from "@/server/api/trpc";

import { addPage } from "./add";
import { deletePage } from "./delete";
import { getAllPages, getPage } from "./get";
import { listPages } from "./list";
import { getRoleAccess, setPageVisibility, setRoleAccess } from "./settings";
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
      return await getPage(
        input.project,
        input.page,
        ctx.session?.user.id ?? ""
      );
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

  togglePublicVisibility: protectedProcedure
    .meta({
      openapi: { tags: ["page"], method: "POST", path: "/page/visibility" },
    })
    .input(
      z.object({
        project: z.string(),
        pagePath: z.string(),
        public: z.boolean(),
      })
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      return await setPageVisibility(
        input.project,
        input.pagePath,
        input.public
      );
    }),

  roleAccess: protectedProcedure
    .meta({
      openapi: {
        tags: ["page", "role"],
        method: "GET",
        path: "/page/role-access",
      },
    })
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
    .query(async ({ input }) => {
      return await getRoleAccess(input.project, input.page);
    }),

  setRoleAccess: protectedProcedure
    .meta({
      openapi: {
        tags: ["page", "role"],
        method: "POST",
        path: "/page/role-access",
      },
    })
    .input(
      z.object({
        project: z.string(),
        page: z.string(),
        role: z.string(),
        access: z.boolean(),
      })
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      return await setRoleAccess(
        input.project,
        input.page,
        input.role,
        input.access
      );
    }),
});
