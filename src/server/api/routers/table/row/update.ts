import { Row } from "@/data/table/row";
import { prisma } from "@/server/database";

export async function updateRow(rowID: string, row: Row): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  const updatePromises = Object.entries(row).map(([key, value]) => {
    return prisma.cell.updateMany({
      where: {
        rowId: rowID,
        column: {
          key,
        },
      },
      data: {
        value: value.toString(),
      },
    });
  });
  await prisma.$transaction(updatePromises);
  return rowID;
}
