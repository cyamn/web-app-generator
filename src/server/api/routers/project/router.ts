import { z } from "zod";

import { PageSchema } from "@/data/page";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { protectedProcedure } from "@/server/api/trpc";

import { addPage } from "../page/add";
import { getAllPages } from "../page/get";
import { updatePage } from "../page/update";
import { addRole } from "../roles/add";
import { listRoles } from "../roles/list";
import { InternalError } from "../shared/errors";
import { addTable } from "../table/add";
import { deserialize } from "../table/data/serialization";
import { getAll } from "../table/get";
import { updateTable } from "../table/update";
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

  get: publicProcedure
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
    .query(async ({ input }) => {
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

  export: protectedProcedure
    .meta({
      openapi: { tags: ["project"], method: "GET", path: "/project/export" },
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
      openapi: { tags: ["project"], method: "POST", path: "/project/import" },
    })
    .input(
      z.object({
        projectID: z.string().optional(),

        project: z.object({
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
        }),
      })
    )
    .output(z.string())
    .mutation(async ({ ctx, input }) => {
      let projectID = input.projectID ?? "";
      if (input.projectID === null) {
        projectID = await addProject(input.project.name, ctx.session.user.id);
        if (projectID === undefined) {
          throw new InternalError("Failed to create project");
        }
      } else {
        await ctx.prisma.project.update({
          where: {
            id: input.projectID,
          },
          data: {
            name: input.project.name,
            description: input.project.description,
          },
        });
      }

      // delete all old roles
      await ctx.prisma.role.deleteMany({
        where: {
          projectId: projectID,
          isAdmin: false,
        },
      });

      // add new roles
      for (const role of input.project.roles) {
        if (role.isAdmin) {
          continue;
        }
        const id = await addRole(role.name, projectID, role.isAdmin);
        if (id === undefined) {
          throw new InternalError("Failed to create role");
        }
        for (const email of role.users) {
          const user = await ctx.prisma.user.findUnique({
            where: {
              email,
            },
          });
          if (user !== null) {
            await ctx.prisma.role.update({
              where: {
                id,
              },
              data: {
                users: {
                  connect: {
                    id: user.id,
                  },
                },
              },
            });
          }
        }
      }

      // delete pages
      await ctx.prisma.page.deleteMany({
        where: {
          projectId: projectID,
        },
      });

      // add pages
      for (const page of input.project.pages) {
        await addPage(ctx.session.user.id, projectID, page.name);
        await updatePage(ctx.session.user.id, projectID, page);
      }

      // delete tables
      await ctx.prisma.table.deleteMany({
        where: {
          projectId: projectID,
        },
      });

      // add tables
      for (const table of input.project.tables) {
        const id = await addTable(ctx.session.user.id, projectID, table.name);
        if (id === undefined) {
          throw new InternalError("Failed to create table");
        }
        await updateTable(projectID, table.name, table.columns, table.data);
      }

      return projectID;
    }),
});
