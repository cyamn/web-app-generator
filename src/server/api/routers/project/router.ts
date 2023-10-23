import { z } from "zod";

import { PageSchema } from "@/data/page";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { protectedProcedure } from "@/server/api/trpc";

import { getAllPages } from "../page/get";
import { listRoles } from "../roles/list";
import { deserialize } from "../table/data/serialization";
import { getAll } from "../table/get";
import { addProject } from "./add";
import { deleteProject } from "./delete";
import { getProject } from "./get";
import { importJSONInputScheme, importProjectFromJSON } from "./import";
import { listProjects } from "./list";

export const projectsRouter = createTRPCRouter({
  add: protectedProcedure
    .meta({
      openapi: {
        description: "Add a project with the issuer as the owner",
        tags: ["project"],
        method: "POST",
        path: "/project",
      },
    })
    .input(z.object({ name: z.string() }))
    .output(z.string())
    .mutation(async ({ ctx, input }) => {
      return await addProject(input.name, ctx.session.user.id);
    }),

  get: publicProcedure
    .meta({
      openapi: {
        description: "Get a project by id",
        tags: ["project"],
        method: "GET",
        path: "/project",
      },
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
    .query(async ({ input }) => {
      return await getProject(input.id);
    }),

  update: protectedProcedure
    .meta({
      openapi: {
        description: "Update project information",
        tags: ["project"],
        method: "PATCH",
        path: "/project",
      },
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

  delete: protectedProcedure
    .meta({
      openapi: {
        description: "Delete a project by id",
        tags: ["project"],
        method: "DELETE",
        path: "/project",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(z.string())
    .mutation(async ({ ctx, input }) => {
      return await deleteProject(input.id, ctx.session.user.id);
    }),

  list: protectedProcedure
    .meta({
      openapi: {
        description: "List all projects that a user is an admin in",
        tags: ["project"],
        method: "GET",
        path: "/project/list",
      },
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

  export: protectedProcedure
    .meta({
      openapi: {
        description: "Export a project as a JSON file",
        tags: ["project"],
        method: "GET",
        path: "/project/export",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(
      z.object({
        name: z.string(),
        description: z.string(),
        pages: z.array(PageSchema),
        roles: z.array(
          z.object({
            name: z.string(),
            users: z.array(z.string()),
            isAdmin: z.boolean(),
          })
        ),
        tables: z.array(
          z.object({
            name: z.string(),
            columns: z.record(z.string(), z.string()),
            data: z.array(z.array(z.string())),
          })
        ),
      })
    )
    .query(async ({ ctx, input }) => {
      const project = await getProject(input.id);

      // list pages
      const pages = await getAllPages(ctx.session.user.id, input.id);
      const roles = await listRoles(input.id);
      const tables = await getAll(input.id);

      return {
        ...project,
        roles: roles.map((role) => {
          return {
            ...role,
            users: role.users.map((user) => user.email ?? ""),
          };
        }),
        pages: pages.map((page) => page.page),
        tables: tables.map((table) => {
          const cols = {};
          for (const column of table.columns) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            cols[column.key] = column.type;
          }
          return {
            name: table.name,
            columns: cols,
            data: deserialize(table).cells.map((row) =>
              row.map((cell) => cell.value)
            ),
          };
        }),
      };
    }),
  import: protectedProcedure
    .meta({
      openapi: {
        description: "Import a project from a JSON file",
        tags: ["project"],
        method: "POST",
        path: "/project/import",
      },
    })
    .input(importJSONInputScheme)
    .output(z.string())
    .mutation(async ({ ctx, input }) => {
      return await importProjectFromJSON(
        ctx.session.user.id,
        input.project,
        input.projectID
      );
    }),
});
