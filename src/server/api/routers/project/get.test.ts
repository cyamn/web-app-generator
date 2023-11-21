import { vi } from "vitest";

import { defaultProject } from "@/data/project";
import { prisma } from "@/server/database.mock";

import { NotFoundError } from "../shared/errors";
import { getProject } from "./get"; // <--- function to test

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

const project = {
  ...defaultProject,
  createdAt: new Date(),
  ownerId: "owner",
  home: "example",
  description: "example",
};

describe("get project function", () => {
  it("should get a project if existing", async () => {
    prisma.project.findFirst.mockResolvedValue(project);
    const result = await getProject("example");
    expect(prisma.project.findFirst).toBeCalledTimes(1);
    expect(result).toEqual(project);
  });
  it("should not get a project if not existing", async () => {
    prisma.project.findFirst.mockResolvedValue(null);

    await expect(
      (async () => {
        await getProject("myproject");
      })(),
    ).rejects.toThrowError(new NotFoundError("project"));

    expect(prisma.project.findFirst).toBeCalledTimes(1);
  });
});
