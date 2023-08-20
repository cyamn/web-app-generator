import cuid from "cuid";

import { Row } from "@/data/table/row";
import { Dict } from "@/data/types";
import { prisma } from "@/server/database";

import { InternalError } from "../../shared/errors";
import { createCells } from "../cell/add";
import { Table } from "../get";

export async function createRows(
  rowSchema: Row[],
  tableId: string
): Promise<string[]> {
  const rowIDs = rowSchema.map(() => cuid());
  await prisma.row.createMany({
    data: rowSchema.map((_, index) => ({
      id: rowIDs[index],
      tableId,
    })),
  });
  return rowIDs;
}

export async function addRow(table: Table, row: Row): Promise<string> {
  const rowID = cuid();
  await prisma.row.create({
    data: {
      id: rowID,
      table: {
        connect: {
          id: table.id,
        },
      },
    },
  });
  // get ids for each column
  const columnCuids: Dict = {};
  for (const column of table.columns) {
    const col = await prisma.column.findFirst({
      where: {
        table: {
          id: table.id,
        },
        key: column.key,
      },
      select: {
        id: true,
      },
    });
    if (!col) throw new InternalError("Column not found");

    columnCuids[column.key] = col.id;
  }
  await createCells([row], columnCuids, [rowID]);
  return rowID;
}
