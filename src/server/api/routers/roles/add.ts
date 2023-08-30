import { prisma } from "@/server/database";

export async function addRole(
  roleName: string,
  project: string,
  isAdmin = false
): Promise<string> {
  const role = await prisma.role.create({
    data: {
      name: roleName,
      isAdmin,
      project: {
        connect: {
          id: project,
        },
      },
    },
  });
  return role.id;
}
