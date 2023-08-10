import cuid from "cuid";

import { Row } from "@/data/table/row";
import { Dict } from "@/data/types";
import { prisma } from "@/server/database";

import { InternalError } from "../../../shared/errors";
import { createCells } from "./create";
import { Table } from "./get";

export async function insert(table: Table, row: Row): Promise<void> {
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
}
