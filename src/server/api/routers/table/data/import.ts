import cuid from "cuid";

import { prisma } from "@/server/database";

import { InternalError, NotFoundError } from "../../shared/errors";
import { get } from "../get";

export async function importCSV(
  project: string,
  csv: string,
  name: string,
  tableName?: string
) {
  let id;
  try {
    if (tableName !== undefined) {
      const table = await get(tableName, project);
      if (table) {
        id = table.id;
      } else {
        throw new NotFoundError("Table");
      }
    }
  } catch (error: unknown) {
    console.log(error);
  }

  const imported = await importCSVIntoExisting(csv, name, project, id);
  if (!imported) throw new InternalError("Failed to import CSV");
  return imported;
}

async function reCreateTable(
  table: string | undefined,
  name: string,
  project: string
) {
  if (table !== undefined) {
    await prisma.table.delete({
      where: {
        id: table,
      },
    });
  }
  return await prisma.table.create({
    data: {
      name: name,
      project: {
        connect: {
          id: project,
        },
      },
    },
  });
}

async function createColumns(newTableId: string, columnRow?: string) {
  if (columnRow === undefined) {
    throw new InternalError("Failed to import CSV");
  }
  const columns = columnRow.split(",");
  const columnIds = [];
  for (const column of columns) {
    const id = cuid();
    const newColumn = await prisma.column.create({
      data: {
        id,
        key: column,
        type: "string",
        table: {
          connect: {
            id: newTableId,
          },
        },
      },
    });
    columnIds.push(newColumn.id);
  }
  return columnIds;
}

async function importCSVIntoExisting(
  csv: string,
  name: string,
  project: string,
  table?: string
) {
  const newTable = await reCreateTable(table, name, project);
  const rows = csv.split("\n");
  const columnIds = await createColumns(newTable.id, rows[0]);

  // create rows
  for (let index = 1; index < rows.length; index++) {
    if (rows[index] === undefined) {
      continue;
    }
    await createRow(newTable.id, columnIds, rows[index] ?? "");
  }

  return newTable.id;
}

async function createRow(
  tableID: string,
  columnIds: string[],
  rowString: string
) {
  const row = rowString.split(",");
  const rowId = cuid();
  const cells = [];
  await prisma.row.create({
    data: {
      id: rowId,
      table: {
        connect: {
          id: tableID,
        },
      },
    },
  });
  for (const [index, element] of row.entries()) {
    if (element === "") {
      continue;
    }
    const newCell = await createCell(columnIds[index] ?? "", rowId, element);
    cells.push(newCell.id);
  }
}

async function createCell(columnID: string, rowID: string, element: string) {
  const cellId = cuid();
  const newCell = await prisma.cell.create({
    data: {
      id: cellId,
      value: element,
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
  return newCell;
}
