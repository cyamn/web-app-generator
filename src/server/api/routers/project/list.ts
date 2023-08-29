import { prisma } from "@/server/database";

export async function listProjects(ownerId: string): Promise<
  Array<{
    name: string;
    updatedAt: Date;
    description: string;
    id: string;
  }>
> {
  const projects = prisma.project.findMany({
    select: {
      name: true,
      updatedAt: true,
      description: true,
      id: true,
    },
    where: {
      ownerId: ownerId,
    },
    orderBy: [
      {
        updatedAt: "desc",
      },
    ],
  });
  return projects;
}
