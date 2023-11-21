import { prisma } from "@/server/database";

import { isProjectAdminFilter } from "../page/shared";
import { NotFoundError } from "../shared/errors";

export async function deleteProject(
  projectID: string,
  userID: string,
): Promise<string> {
  const project = await prisma.project.deleteMany({
    where: {
      id: projectID,
      OR: isProjectAdminFilter(userID),
    },
  });
  if (project.count === 0) {
    throw new NotFoundError(projectID);
  }
  return projectID;
}
