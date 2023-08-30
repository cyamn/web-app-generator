import { prisma } from "@/server/database";

export async function getAdmins(projectId: string): Promise<
  Array<{
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  }>
> {
  const admins = await prisma.user.findMany({
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
          isAdmin: true,
        },
      },
    },
  });
  if (admins === undefined) {
    return [];
  }
  return admins;
}
