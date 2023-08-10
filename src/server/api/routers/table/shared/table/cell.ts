import { Cell } from "@prisma/client";

import { prisma } from "@/server/database";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function set(id: string, value: string): Promise<Cell> {
  return await prisma.cell.update({
    where: {
      id: id,
    },
    data: {
      value: value,
    },
  });
}

export async function get(id: string): Promise<Cell | null> {
  return await prisma.cell.findFirst({
    where: {
      id: id,
    },
  });
}
