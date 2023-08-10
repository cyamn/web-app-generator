import cuid from "cuid";

import { defaultTable, type Table } from "@/data/table";
import { type Column } from "@/data/table/column";
import { type Row } from "@/data/table/row";
import { prisma } from "@/server/database";

export async function createTable(
  projectID: string,
  tableSchema: Table = defaultTable
): Promise<string> {
  const table = await prisma.table.create({
    data: {
      name: tableSchema.name,
      projectId: projectID,
    },
  });

  const columnIDs = await createColumns(tableSchema.columns, table.id);
  const rowIDs = await createRows(tableSchema.rows, table.id);
  await createCells(tableSchema.rows, columnIDs, rowIDs);

  return table.id;
}

async function createColumns(
  columnSchema: Column[],
  tableId: string
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

async function createRows(
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
