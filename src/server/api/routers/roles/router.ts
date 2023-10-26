import { z } from "zod";

import { createTRPCRouter } from "@/server/api/trpc";
import { protectedProcedure } from "@/server/api/trpc";

import { addRole } from "./add";
import { addUserToRole, getUserByEmail, removeUserFromRole } from "./assign";
import { deleteRole } from "./assign copy";
import { getRolesOfUserInProject } from "./get";
import { listRoles } from "./list";
import { updateRole } from "./update";
import { getUsers } from "./users";

export const rolesRouter = createTRPCRouter({
  get: protectedProcedure
    .meta({
      openapi: {
        description: "Get a role by id",
        tags: ["role"],
        method: "GET",
        path: "/role",
      },
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

  add: protectedProcedure
    .meta({
      openapi: {
        description: "Add a role to a project",
        tags: ["role"],
        method: "POST",
        path: "/role",
      },
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

  update: protectedProcedure
    .meta({
      openapi: {
        description: "Update a role name",
        tags: ["role"],
        method: "PATCH",
        path: "/role",
      },
    })
    .input(
      z.object({
        roleID: z.string(),
        roleName: z.string(),
      })
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      return await updateRole(input.roleID, input.roleName);
    }),

  delete: protectedProcedure
    .meta({
      openapi: {
        description: "Delete a role from a project",
        tags: ["role"],
        method: "DELETE",
        path: "/role",
      },
    })
    .input(
      z.object({
        roleID: z.string(),
      })
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      return await deleteRole(input.roleID);
    }),

  list: protectedProcedure
    .meta({
      openapi: {
        description: "List all roles in a project",
        tags: ["role"],
        method: "GET",
        path: "/role/list",
      },
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
      openapi: {
        description: "Assign a user to a role by email",
        tags: ["role"],
        method: "POST",
        path: "/role/assign/email",
      },
    })
    .input(
      z.object({
        role: z.string(),
        email: z.string(),
      })
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      const user = await getUserByEmail(input.email);
      return await addUserToRole(user, input.role);
    }),

  unAssignUserToRoleByMail: protectedProcedure
    .meta({
      openapi: {
        description: "Unassign a user from a role by email",
        tags: ["role"],
        method: "DELETE",
        path: "/role/unassign/email",
      },
    })
    .input(
      z.object({
        role: z.string(),
        email: z.string(),
      })
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      const user = await getUserByEmail(input.email);
      return await removeUserFromRole(user, input.role);
    }),

  assignUserToRoleById: protectedProcedure
    .meta({
      openapi: {
        description: "Assign a user to a role by id",
        tags: ["role"],
        method: "POST",
        path: "/role/assign/id",
      },
    })
    .input(
      z.object({
        role: z.string(),
        user: z.string(),
      })
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      return await addUserToRole(input.user, input.role);
    }),

  unAssignUserToRoleById: protectedProcedure
    .meta({
      openapi: {
        description: "Unassign a user from a role by id",
        tags: ["role"],
        method: "DELETE",
        path: "/role/unassign/id",
      },
    })
    .input(
      z.object({
        role: z.string(),
        user: z.string(),
      })
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      return await removeUserFromRole(input.user, input.role);
    }),

  getUsers: protectedProcedure
    .meta({
      openapi: {
        description: "Get all users in a role",
        tags: ["role"],
        method: "GET",
        path: "/role/users",
      },
    })
    .input(
      z.object({
        project: z.string(),
        isAdmin: z.boolean().optional(),
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
      return await getUsers(input.project, input.isAdmin);
    }),
});
