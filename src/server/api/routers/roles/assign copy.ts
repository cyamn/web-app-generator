import { prisma } from "@/server/database";

export async function deleteRole(roleId: string): Promise<string> {
  const deletedRole = await prisma.role.delete({
    where: {
      id: roleId,
    },
  });
  return deletedRole.id;
}
