import { prisma } from "@/server/database";

import { InternalError } from "../shared/errors";

export async function deleteTable(table: string, project: string) {
  const toDelete = await prisma.table.findFirst({
    where: {
      name: table,
      projectId: project,
    },
  });
  if (!toDelete) throw new InternalError("Failed to delete table");
  await prisma.table.delete({
    where: {
      id: toDelete.id,
    },
  });
  return toDelete.id;
}
