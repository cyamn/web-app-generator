// src/tests/helpers/reset-db.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const testData = {
  projectID: "some-project",
};

export default async () => {
  await prisma.$transaction([
    // users
    prisma.account.deleteMany(),
    prisma.session.deleteMany(),
    prisma.user.deleteMany(),
    prisma.role.deleteMany(),
    prisma.rule.deleteMany(),
    prisma.verificationToken.deleteMany(),

    // projects, page,...
    prisma.project.deleteMany(),
    prisma.page.deleteMany(),
    prisma.roleAccessPage.deleteMany(),

    // table
    prisma.table.deleteMany(),
    prisma.column.deleteMany(),
    prisma.row.deleteMany(),
    prisma.cell.deleteMany(),

    // create example project
    prisma.project.create({
      data: {
        id: testData.projectID,
        name: "example",
        description: "Example project",
        home: "",
        ownerId: "test",
      },
    }),
  ]);
};
