import { prisma } from "@/server/database";

import { NotFoundError } from "../shared/errors";

export async function addUserToRole(
  userId: string,
  roleId: string
): Promise<string> {
  const updatedRole = await prisma.role.update({
    where: {
      id: roleId,
    },
    data: {
      users: {
        connect: {
          id: userId,
        },
      },
    },
  });
  return updatedRole.id;
}

export async function getUserByEmail(email: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    throw new NotFoundError("User");
  }
  return user.id;
}
