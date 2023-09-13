import { z } from "zod";

import { createTRPCRouter } from "@/server/api/trpc";
import { protectedProcedure } from "@/server/api/trpc";

import { addRole } from "./add";
import { getAdmins } from "./admins";
import { addUserToRole, getUserByEmail } from "./assign";
import { getRolesOfUserInProject } from "./get";
import { listRoles } from "./list";

export const rolesRouter = createTRPCRouter({
  add: protectedProcedure
    .meta({
      openapi: { tags: ["role"], method: "POST", path: "/role" },
    })
    .input(
      z.object({
        role: z.string(),
        project: z.string(),
      })
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      return await addRole(input.role, input.project);
    }),

  get: protectedProcedure
    .meta({
      openapi: { tags: ["role"], method: "GET", path: "/role" },
    })
    .input(
      z.object({
        user: z.string(),
        project: z.string(),
      })
    )
    .output(z.array(z.string()))
    .query(async ({ input }) => {
      return await getRolesOfUserInProject(input.user, input.project);
    }),

  list: protectedProcedure
    .meta({
      openapi: { tags: ["role"], method: "GET", path: "/role/list" },
    })
    .input(
      z.object({
        project: z.string(),
      })
    )
    .output(
      z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          users: z.array(
            z.object({
              id: z.string(),
              email: z.string().nullable(),
              name: z.string().nullable(),
              image: z.string().nullable(),
            })
          ),
          rules: z.array(
            z.object({
              id: z.string(),
              regex: z.string(),
            })
          ),
        })
      )
    )
    .query(async ({ input }) => {
      return await listRoles(input.project);
    }),

  assignUserToRoleByMail: protectedProcedure
    .meta({
      openapi: { tags: ["role"], method: "POST", path: "/role/assign/email" },
    })
    .input(
      z.object({
        project: z.string(),
        role: z.string(),
        email: z.string(),
      })
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      const user = await getUserByEmail(input.email);
      return await addUserToRole(user, input.role);
    }),

  assignUserToRoleById: protectedProcedure
    .meta({
      openapi: { tags: ["role"], method: "POST", path: "/role/assign/id" },
    })
    .input(
      z.object({
        project: z.string(),
        role: z.string(),
        user: z.string(),
      })
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      return await addUserToRole(input.user, input.role);
    }),

  getAdmins: protectedProcedure
    .meta({
      openapi: { tags: ["role"], method: "GET", path: "/role/admins" },
    })
    .input(
      z.object({
        project: z.string(),
      })
    )
    .output(
      z.array(
        z.object({
          id: z.string(),
          email: z.string().nullable(),
          name: z.string().nullable(),
          image: z.string().nullable(),
        })
      )
    )
    .query(async ({ input }) => {
      return await getAdmins(input.project);
    }),
});
