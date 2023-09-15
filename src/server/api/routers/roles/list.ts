import { Rule, User } from "@prisma/client";

import { prisma } from "@/server/database";

export async function listRoles(project: string): Promise<
  Array<{
    id: string;
    name: string;
    users: User[];
    rules: Rule[];
  }>
> {
  const roles = await prisma.role.findMany({
    where: {
      project: {
        id: project,
      },
    },
    select: {
      id: true,
      name: true,
      users: true,
      rules: true,
    },
  });
  return roles;
}
