import { describe, expect, it } from "vitest";
import prisma from "../helpers/prisma";

describe("prisma setup", async () => {
  it("should create and persist a new user", async () => {
    await prisma.user.create({
      data: {
        email: "mail@example.com",
        name: "test",
      },
    });
    const user = await prisma.user.findUnique({
      where: {
        email: "mail@example.com",
      },
    });
    expect(user).toBeDefined();
    expect(user).not.toBeNull();
    expect(user!.name).equals("test");
  });
});
