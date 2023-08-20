import { prisma } from "@/server/database";

export async function updateColumn(
  columnID: string,
  key: string,
  type: string
): Promise<string> {
  const updated = await prisma.column.update({
    where: {
      id: columnID,
    },
    data: {
      key,
      type,
    },
  });
  return updated.id;
}
