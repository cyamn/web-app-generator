import { Page } from "@/data/page";
import { prisma } from "@/server/database";

import { isProjectAdminFilter } from "./shared";

export async function updatePage(
  userID: string,
  projectID: string,
  page: Page,
  path: string = page.path,
): Promise<string> {
  const delta = await prisma.page.updateMany({
    where: {
      path,
      project: {
        id: projectID,
        OR: isProjectAdminFilter(userID),
      },
    },
    data: {
      name: page.name,
      path: page.path,
      variables: JSON.stringify(page.variables),
      dashboards: JSON.stringify(page.dashboards),
      public: page.access?.public ?? false,
    },
  });
  return delta.count.toString();
}
