import { prisma } from "@/server/database";

import { InternalError } from "../../shared/errors";
import { Table } from "../get";

export async function deleteRow(table: Table, rowId: string): Promise<string> {
  const row = await prisma.row.findUnique({
    where: { id: rowId },
    include: { cells: true },
  });
  if (!row) throw new InternalError("Row not found");

  await prisma.row.delete({ where: { id: rowId } });
  await prisma.cell.deleteMany({ where: { rowId } });

  return rowId;
}
