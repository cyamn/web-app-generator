import { z } from "zod";

import { PageSchema } from "@/data/page";
import { prisma } from "@/server/database";

import { addPage } from "../page/add";
import { updatePage } from "../page/update";
import { addRole } from "../roles/add";
import { InternalError } from "../shared/errors";
import { addTable } from "../table/add";
import { updateTable } from "../table/update";
import { addProject } from "./add";

export const importJSONInputScheme = z.object({
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
      }),
    ),
    tables: z.array(
      z.object({
        name: z.string(),
        columns: z.record(z.string(), z.string()),
        data: z.array(z.array(z.string())),
      }),
    ),
  }),
});

export async function importProjectFromJSON(
  userID: string,
  project: z.infer<typeof importJSONInputScheme>["project"],
  projectID?: string,
): Promise<string> {
  if (projectID === undefined) {
    projectID = await addProject(project.name, userID);
    if (projectID === undefined) {
      throw new InternalError("Failed to create project");
    }
  } else {
    await prisma.project.update({
      where: {
        id: projectID,
      },
      data: {
        name: project.name,
        description: project.description,
      },
    });
  }

  // delete all old roles
  await prisma.role.deleteMany({
    where: {
      projectId: projectID,
      isAdmin: false,
    },
  });

  // add new roles
  for (const role of project.roles) {
    if (role.isAdmin) {
      continue;
    }
    const id = await addRole(role.name, projectID, role.isAdmin);
    if (id === undefined) {
      throw new InternalError("Failed to create role");
    }
    for (const email of role.users) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (user !== null) {
        await prisma.role.update({
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
  await prisma.page.deleteMany({
    where: {
      projectId: projectID,
    },
  });

  // add pages
  for (const page of project.pages) {
    await addPage(userID, projectID, page.name);
    await updatePage(userID, projectID, page);
  }

  // delete tables
  await prisma.table.deleteMany({
    where: {
      projectId: projectID,
    },
  });

  // add tables
  for (const table of project.tables) {
    const id = await addTable(userID, projectID, table.name);
    if (id === undefined) {
      throw new InternalError("Failed to create table");
    }
    await updateTable(projectID, table.name, table.columns, table.data);
  }

  return projectID;
}
