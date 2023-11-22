import { vi } from "vitest";

import { prisma } from "@/server/database.mock";

import { inRole } from "./in-role"; // <--- function to test

const IN_ROLE: (userID: string, roleName: string) => Promise<boolean> =
  inRole("someID");

vi.mock("@/server/database", () => {
  return {
    prisma: prisma,
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("in role function", () => {
  it("should return true if user is in role", async () => {
    prisma.role.findFirst.mockResolvedValue({
      id: "someID",
      name: "role",
      isAdmin: false,
      projectId: "projectID",
    });
    const result = await IN_ROLE("user", "role");
    expect(prisma.role.findFirst).toHaveBeenCalledTimes(1);
    expect(result).toEqual(true);
  });
  it("should return false if user is not in role", async () => {
    prisma.role.findFirst.mockResolvedValue(null);
    const result = await IN_ROLE("user", "role");
    expect(prisma.role.findFirst).toHaveBeenCalledTimes(1);
    expect(result).toEqual(false);
  });
});
