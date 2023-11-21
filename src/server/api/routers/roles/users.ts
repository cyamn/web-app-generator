import { prisma } from "@/server/database";

export async function getUsers(
  projectId: string,
  admin = false,
): Promise<
  Array<{
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  }>
> {
  const isAdminFilter = admin ? { isAdmin: true } : undefined;

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
    where: {
      roles: {
        some: {
          projectId,
          ...isAdminFilter,
        },
      },
    },
  });
  if (users === undefined) {
    return [];
  }
  return users;
}
