import { prisma } from "@/server/database";

import { isProjectAdminFilter } from "./shared";

export async function deletePage(
  userID: string,
  projectID: string,
  pagePath: string
): Promise<string> {
  const delta = await prisma.page.deleteMany({
    where: {
      path: pagePath,
      project: {
        id: projectID,
        OR: isProjectAdminFilter(userID),
      },
    },
  });
  return delta.count.toString();
}
