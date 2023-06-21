import { defaultTable, type Table } from "@/data/table";
import { type Row } from "@/data/table/row";
import cuid from "cuid";
import { ColumnSchema, type Column } from "@/data/table/column";
import { prisma } from "@/server/db";

export async function createTable(
  projectID: string,
  tableSchema: Table = defaultTable
) {
  const table = await prisma.table.create({
    data: {
      name: tableSchema.name,
      projectId: projectID,
    },
  });

  const columnCuids = await buildColumns(tableSchema.columns, table.id);
  const rowCuids = await buildRows(tableSchema.rows, table.id);
  await buildCells(tableSchema.rows, columnCuids, rowCuids);

  return table.id;
}

async function buildColumns(columnSchema: Column[], tableId: string) {
  const columnCuids: Record<string, string> = {};
  for (const column of columnSchema) {
    columnCuids[column.key] = cuid();
  }
  await prisma.column.createMany({
    data: columnSchema.map((column) => ({
      id: columnCuids[column.key],
      key: column.key,
      type: column.type,
      tableId: tableId,
    })),
  });
  return columnCuids;
}

async function buildRows(rowSchema: Row[], tableId: string) {
  const rowCuids = rowSchema.map(() => cuid());
  await prisma.row.createMany({
    data: rowSchema.map((_, index) => ({
      id: rowCuids[index],
      tableId,
    })),
  });
  return rowCuids;
}

async function buildCells(
  rowSchema: Row[],
  columnCuids: Record<string, string>,
  rowCuids: string[]
) {
  return await prisma.cell.createMany({
    data: rowSchema
      .map((row: Row, rowIndex) =>
        Object.keys(row).map((key, columnIndex) => ({
          rowId: rowCuids[rowIndex]!,
          columnId: columnCuids[key]!,
          value: row[key]?.toString() ?? "",
        }))
      )
      .flat(),
  });
}

export async function getProjectTableDeep(
  projectName: string,
  tableName: string,
  sessionUserId: string
) {
  return await prisma.project.findFirst({
    where: {
      name: projectName,
      ownerId: sessionUserId,
    },
    select: {
      tables: {
        where: {
          name: {
            equals: tableName,
          },
        },
        select: {
          id: true,
          name: true,
          columns: {
            select: {
              id: true,
              key: true,
              type: true,
            },
          },
          rows: {
            select: {
              id: true,
              cells: {
                select: {
                  column: {
                    select: {
                      key: true,
                    },
                  },
                  value: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
