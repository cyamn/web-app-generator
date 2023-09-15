import { prisma } from "@/server/database";

export async function getRolesOfUserInProject(
  userId: string,
  projectId: string
): Promise<Array<string>> {
  const roles = await prisma.role.findMany({
    select: {
      name: true,
    },
    where: {
      projectId,
      users: {
        some: {
          id: userId,
        },
      },
    },
  });
  if (roles === undefined) {
    return [];
  }
  return roles.map((role) => role.name);
}
