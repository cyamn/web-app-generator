import { vi } from "vitest";

import { prisma } from "@/server/database.mock";

import { NotFoundError } from "../shared/errors";
import { deleteProject } from "./delete"; // <--- function to test

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

describe("delete project function", () => {
  it("should delete a project if existing and right permissions", async () => {
    prisma.project.deleteMany.mockResolvedValueOnce({ count: 1 });
    const result = await deleteProject("example", "owner");
    expect(prisma.project.deleteMany).toBeCalledTimes(1);
    expect(result).toEqual("example");
  });
  it("should not delete a project if not existing or not right permissions", async () => {
    prisma.project.deleteMany.mockResolvedValueOnce({ count: 0 });

    await expect(
      (async () => {
        await deleteProject("project", "owner");
      })(),
    ).rejects.toThrowError(new NotFoundError("project"));

    expect(prisma.project.deleteMany).toBeCalledTimes(1);
  });
});
