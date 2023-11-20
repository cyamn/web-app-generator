import { FormulaHelpers, Types } from "fast-formula-parser";

import { prisma } from "@/server/database";

export const inRole =
  (projectId: string) => async (userID: string, roleName: string) => {
    userID = FormulaHelpers.accept(userID, Types.STRING);
    roleName = FormulaHelpers.accept(roleName, Types.STRING);
    const role = await prisma.role.findFirst({
      where: {
        projectId,
        name: roleName,
        users: {
          some: {
            id: userID,
          },
        },
      },
    });
    return role !== null;
  };
