import { prisma } from "@/server/database";

export async function addRole(
  roleName: string,
  project: string
): Promise<string> {
  const role = await prisma.role.create({
    data: {
      name: roleName,
      project: {
        connect: {
          id: project,
        },
      },
    },
  });
  return role.id;
}
