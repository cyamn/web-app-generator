import { prisma } from "@/server/database";

import { isProjectAdminFilter } from "../page/shared";

export async function listProjects(userID: string): Promise<
  Array<{
    name: string;
    updatedAt: Date;
    description: string;
    id: string;
  }>
> {
  const projects = prisma.project.findMany({
    select: {
      name: true,
      updatedAt: true,
      description: true,
      id: true,
    },
    where: {
      OR: isProjectAdminFilter(userID),
    },
    orderBy: [
      {
        updatedAt: "desc",
      },
    ],
  });
  return projects;
}
