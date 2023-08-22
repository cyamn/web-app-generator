import { defaultPage } from "@/data/page";
import { prisma } from "@/server/database";
import { nameToInternal } from "@/utils/name-to-internal";

import { NotFoundError } from "../shared/errors";

export async function addPage(
  userId: string,
  projectId: string,
  pageName: string
): Promise<string> {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId,
    },
  });
  if (!project) {
    throw new NotFoundError("Project");
  }
  const page = await prisma.page.create({
    data: {
      name: pageName,
      path: nameToInternal(pageName),
      variables: JSON.stringify(defaultPage.variables),
      dashboards: JSON.stringify(defaultPage.dashboards),
      projectId: project.id,
    },
  });
  return page.id;
}
