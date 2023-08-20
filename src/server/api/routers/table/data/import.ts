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

import cuid from "cuid";

import { prisma } from "@/server/database";

async function importCSVIntoExisting(
  csv: string,
  name: string,
  project: string,
  table?: string
) {
  if (table !== undefined) {
    // delete table
    await prisma.table.delete({
      where: {
        id: table,
      },
    });
  }
  // create new table
  const newTable = await prisma.table.create({
    data: {
      name: name,
      project: {
        connect: {
          id: project,
        },
      },
    },
  });
  // create columns
  const rows = csv.split("\n");
  if (rows[0] === undefined) {
    throw new InternalError("Failed to import CSV");
  }
  const columns = rows[0].split(",");
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
            id: newTable.id,
          },
        },
      },
    });
    columnIds.push(newColumn.id);
  }

  // create rows
  for (let index = 1; index < rows.length; index++) {
    if (rows[index] === undefined) {
      continue;
    }
    const row = rows[index]!.split(",");
    const rowId = cuid();
    const cells = [];
    await prisma.row.create({
      data: {
        id: rowId,
        table: {
          connect: {
            id: newTable.id,
          },
        },
      },
    });
    for (const [index_, element] of row.entries()) {
      if (element === "") {
        continue;
      }
      const cellId = cuid();
      const newCell = await prisma.cell.create({
        data: {
          id: cellId,
          value: element,
          column: {
            connect: {
              id: columnIds[index_],
            },
          },
          row: {
            connect: {
              id: rowId,
            },
          },
        },
      });
      cells.push(newCell.id);
    }
  }

  return newTable.id;
}
