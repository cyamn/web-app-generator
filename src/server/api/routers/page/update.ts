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
      variables: JSON.stringify(page.variables),
      dashboards: JSON.stringify(page.dashboards),
      public: page.access?.public ?? false,
    },
  });
  return delta.count.toString();
}
