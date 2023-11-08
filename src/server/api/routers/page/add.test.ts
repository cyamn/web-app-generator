import { vi } from "vitest";

import { prisma } from "@/server/database.mock";

import { NotFoundError } from "../shared/errors";
import { addPage } from "./add"; // <--- function to test

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

describe("add page function", () => {
  it("should throw error if project does not exist", async () => {
    prisma.project.findFirst.mockResolvedValue(null);
    await expect(
      (async () => {
        await addPage("owner", "someID", "somePage");
      })()
    ).rejects.toThrowError(new NotFoundError("Project"));
  });
  it("should add a page if project exists", async () => {
    prisma.project.findFirst.mockResolvedValue({ id: "someID" });
    prisma.page.create.mockResolvedValue({ id: "someID" });
    const result = await addPage("owner", "someID", "somePage");
    expect(prisma.page.create).toBeCalledTimes(1);
    expect(result).toEqual("someID");
  });
});
