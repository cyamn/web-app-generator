import { Page } from "@/data/page";
import { prisma } from "@/server/database";

export async function updatePage(
  userID: string,
  projectID: string,
  page: Page
): Promise<string> {
  const delta = await prisma.page.updateMany({
    where: {
      path: page.path,
      project: {
        id: projectID,
        ownerId: userID,
      },
    },
    data: {
      name: page.name,
      path: page.path,
      dashboards: JSON.stringify(page.dashboards),
    },
  });
  return delta.count.toString();
}
