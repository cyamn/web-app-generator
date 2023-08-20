import { type Row } from "@/data/table/row";
import { prisma } from "@/server/database";

export async function createCells(
  rowSchema: Row[],
  columnIDs: Record<string, string>,
  rowIDs: string[]
): Promise<void> {
  await prisma.cell.createMany({
    data: rowSchema.flatMap((row: Row, rowIndex) =>
      Object.keys(row).map((key, columnIndex) => ({
        rowId: rowIDs[rowIndex]!,
        columnId: columnIDs[key]!,
        value: row[key]?.toString() ?? "",
      }))
    ),
  });
}

export async function addCell(
  columnID: string,
  rowID: string,
  value: string
): Promise<string> {
  const cell = await prisma.cell.create({
    data: {
      value,
      column: {
        connect: {
          id: columnID,
        },
      },
      row: {
        connect: {
          id: rowID,
        },
      },
    },
  });
  return cell.id;
}
