import cuid from "cuid";

import { prisma } from "@/server/database";

export async function importCSV(
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
    const row = rows[index].split(",");
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
