import { prisma } from "@/server/database";

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
        ownerId: userID,
      },
    },
  });
  return delta.count.toString();
}
