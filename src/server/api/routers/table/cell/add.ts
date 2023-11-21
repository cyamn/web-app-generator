import { type Row } from "@/data/table/row";
import { prisma } from "@/server/database";

import { InternalError } from "../../shared/errors";

export async function createCells(
  rowSchema: Row[],
  columnIDs: Record<string, string>,
  rowIDs: string[],
): Promise<void> {
  await prisma.cell.createMany({
    data: rowSchema.flatMap((row: Row, rowIndex) => {
      return Object.keys(row).map((key) => {
        const rowId = rowIDs[rowIndex];
        const columnId = columnIDs[key];
        if (rowId === undefined || columnId === undefined)
          throw new InternalError("Failed to create Cell");
        return {
          rowId,
          columnId,
          value: row[key]?.toString() ?? "",
        };
      });
    }),
  });
}

export async function addCell(
  columnID: string,
  rowID: string,
  value: string,
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
