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

  const columnCuids = await buildColumns(tableSchema.columns, table.id);
  const rowCuids = await buildRows(tableSchema.rows, table.id);
  await buildCells(tableSchema.rows, columnCuids, rowCuids);

  return table.id;
}

async function buildColumns(
  columnSchema: Column[],
  tableId: string
): Promise<Record<string, string>> {
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

async function buildRows(rowSchema: Row[], tableId: string): Promise<string[]> {
  const rowCuids = rowSchema.map(() => cuid());
  await prisma.row.createMany({
    data: rowSchema.map((_, index) => ({
      id: rowCuids[index],
      tableId,
    })),
  });
  return rowCuids;
}

export async function buildCells(
  rowSchema: Row[],
  columnCuids: Record<string, string>,
  rowCuids: string[]
): Promise<void> {
  await prisma.cell.createMany({
    data: rowSchema.flatMap((row: Row, rowIndex) =>
      Object.keys(row).map((key, columnIndex) => ({
        rowId: rowCuids[rowIndex]!,
        columnId: columnCuids[key]!,
        value: row[key]?.toString() ?? "",
      }))
    ),
  });
}

type Filter = {
  column: string;
  operator: string;
  value: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function getProjectTableDeep(
  projectName: string,
  tableName: string,
  columns?: string[]
) {
  const columnsFilter = columns
    ? {
        where: {
          key: {
            in: columns,
          },
        },
      }
    : undefined;

  return await prisma.project.findFirst({
    where: {
      id: projectName,
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
            ...columnsFilter,
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
