import { prisma } from "@/server/database";

import { NotFoundError } from "../shared/errors";

export async function getProject(projectId: string): Promise<{
  name: string;
  id: string;
  createdAt: Date;
  description: string;
}> {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
    },
  });
  if (!project) {
    throw new NotFoundError("project");
  }
  return {
    ...project,
    description: project.description ?? "",
  };
}
