import { prisma } from "@/server/database";

export async function updateCell(
  cellID: string,
  value: string,
): Promise<string> {
  const updated = await prisma.cell.update({
    where: {
      id: cellID,
    },
    data: {
      value,
    },
  });
  return updated.id;
}
