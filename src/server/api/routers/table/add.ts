import { TRPCError } from "@trpc/server";

import { defaultTable, Table } from "@/data/table";
import { prisma } from "@/server/database";

import { createCells } from "./cell/add";
import { createColumns } from "./column/add";
import { createRows } from "./row/add";

export async function addTable(
  userID: string,
  projectID: string,
  tableName: string
) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectID,
      ownerId: userID,
    },
  });
  if (!project) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Project not found",
    });
  }
  const tableSchema = defaultTable;
  tableSchema.name = tableName;
  return await createTable(project.id, tableSchema);
}

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
