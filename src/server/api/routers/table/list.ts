import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { prisma } from "@/server/database";

import { idListSchema } from "../parameter-schemas";

export async function listTables(
  userID: string,
  projectID: string
): Promise<z.infer<typeof idListSchema>> {
  const tables = await prisma.table.findMany({
    where: {
      project: {
        ownerId: userID,
        id: projectID,
      },
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  if (tables === null) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Project not found",
    });
  }
  return tables;
}
