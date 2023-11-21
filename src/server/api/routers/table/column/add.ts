import cuid from "cuid";

import { type Column } from "@/data/table/column";
import { prisma } from "@/server/database";

export async function createColumns(
  columnSchema: Column[],
  tableId: string,
): Promise<Record<string, string>> {
  const columnIDs: Record<string, string> = {};
  for (const column of columnSchema) {
    columnIDs[column.key] = cuid();
  }
  await prisma.column.createMany({
    data: columnSchema.map((column) => ({
      id: columnIDs[column.key],
      key: column.key,
      type: column.type,
      tableId: tableId,
    })),
  });
  return columnIDs;
}

export async function createColumn(
  tableID: string,
  key: string,
  type: string,
): Promise<string> {
  const column = await prisma.column.create({
    data: {
      key,
      type,
      table: {
        connect: {
          id: tableID,
        },
      },
    },
  });
  return column.id;
}
