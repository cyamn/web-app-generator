import { Table } from "@prisma/client";

import { type Column } from "@/data/table/column";
import { prisma } from "@/server/database";

import { NotFoundError } from "../shared/errors";
import { createCells } from "./cell/add";
import { createColumns } from "./column/add";
import { createRows } from "./row/add";

export async function updateTable(
  projectID: string,
  tableName: string,
  columnsRecord: Record<string, string>,
  data: string[][],
  newName: string = tableName
): Promise<string> {
  const table = await getUpdatedTable(tableName, projectID, newName);
  const columns: Column[] = await recreatedColumns(table, columnsRecord);
  const columnIDs = await createColumns(columns, table.id);
  await insertData(data, columns, table, columnIDs);

  return projectID;
}
async function insertData(
  data: string[][],
  columns: { type: "string" | "number" | "boolean" | "date"; key: string }[],
  table: Table,
  columnIDs: Record<string, string>
) {
  const rows = data.map((row) => {
    const rowRecord: Record<string, string> = {};
    for (const [index, value] of row.entries()) {
      const column = columns[index];
      if (!column) {
        throw new NotFoundError("column");
      }
      rowRecord[column.key] = value;
    }
    return rowRecord;
  });

  const rowIDs = await createRows(rows, table.id);

  await createCells(rows, columnIDs, rowIDs);
}

async function recreatedColumns(
  table: Table,
  columnsRecord: Record<string, string>
) {
  await prisma.row.deleteMany({
    where: {
      tableId: table.id,
    },
  });
  await prisma.column.deleteMany({
    where: {
      tableId: table.id,
    },
  });

  const columns: Column[] = Object.entries(columnsRecord).map(
    ([key, value]) => {
      if (!["string", "number", "boolean", "date"].includes(value)) {
        return {
          key,
          type: "string",
        };
      }
      type Type = "string" | "number" | "boolean" | "date";
      const type: Type = value as Type;
      return {
        key,
        type,
      };
    }
  );
  return columns;
}

async function getUpdatedTable(
  tableName: string,
  projectID: string,
  newName: string
) {
  const table = await prisma.table.findFirst({
    where: {
      name: tableName,
      projectId: projectID,
    },
  });

  if (!table) {
    throw new NotFoundError("table");
  }

  if (newName !== tableName && newName !== "") {
    await prisma.table.updateMany({
      where: {
        id: table.id,
      },
      data: {
        name: newName,
      },
    });
  }
  return table;
}
