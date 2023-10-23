import { prisma } from "@/server/database";

export async function updateRole(
  roleID: string,
  roleName: string
): Promise<string> {
  const role = await prisma.role.update({
    where: {
      id: roleID,
    },
    data: {
      name: roleName,
    },
  });
  return role.id;
}
