import { defaultPage } from "@/data/page";
import { defaultWebApp } from "@/data/webapp";
import { prisma } from "@/server/database";

import { addRole } from "../roles/add";
import { addUserToRole } from "../roles/assign";
import { createTable } from "../table/add";

export async function addProject(
  name: string,
  ownerId: string,
  description = "my amazing project"
): Promise<string> {
  const project = await prisma.project.create({
    data: {
      name,
      ownerId,
      description,
      home: defaultWebApp.home,
      pages: {
        create: [
          {
            name: defaultPage.name,
            path: defaultPage.path,
            dashboards: JSON.stringify(defaultPage.dashboards),
          },
        ],
      },
    },
  });
  await seedProject(project.id, ownerId);
  return project.id;
}

async function seedProject(projectId: string, ownerId: string) {
  await createTable(projectId);
  const adminRole = await addRole("admin", projectId, true);
  await addUserToRole(ownerId, adminRole);
}
