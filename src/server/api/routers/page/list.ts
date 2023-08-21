import { prisma } from "@/server/database";

import { NotFoundError } from "../shared/errors";

export async function listPages(
  userID: string,
  projectID: string
): Promise<{ name: string; path: string }[]> {
  const project = await prisma.project.findFirst({
    where: {
      id: projectID,
      ownerId: userID,
    },
    select: {
      pages: {
        select: {
          name: true,
          path: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
  });
  if (!project) throw new NotFoundError("Project");
  return project.pages;
}
