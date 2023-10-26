import { prisma } from "@/server/database";

import { isProjectAdminFilter } from "./shared";

export async function listPages(
  userID: string,
  projectID: string
): Promise<{ name: string; path: string }[]> {
  const pages = await prisma.page.findMany({
    where: {
      projectId: projectID,
      OR: [
        { public: true },
        {
          project: {
            OR: isProjectAdminFilter(userID),
          },
        },
        {
          canView: {
            some: {
              role: {
                users: {
                  some: {
                    id: userID,
                  },
                },
              },
            },
          },
        },
      ],
    },
    select: {
      name: true,
      path: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return pages;
}
