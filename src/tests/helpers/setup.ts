import { beforeEach } from "vitest";

import prisma from "./prisma";
import resetDatabase from "./reset-database";

beforeEach(async () => {
  await resetDatabase();

  // create a user
  await prisma.user.create({
    data: {
      id: "test",
      name: "test",
      email: "test@test.com",
    },
  });
});
