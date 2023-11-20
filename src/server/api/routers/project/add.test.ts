import { vi } from "vitest";

import { defaultProject } from "@/data/project";
import { prisma } from "@/server/database.mock";

import { addRole } from "../roles/add";
import { addUserToRole } from "../roles/assign";
import { createTable } from "../table/add";
import { addProject } from "./add"; // <--- function to test

vi.mock("@/server/database", () => {
  return {
    prisma: prisma,
  };
});

vi.mock("../table/add");
vi.mock("../roles/add");
vi.mock("../roles/assign");

afterEach(() => {
  vi.clearAllMocks();
});

beforeEach(() => {
  vi.restoreAllMocks();
  prisma.project.create.mockResolvedValue(project);
});

const project = {
  ...defaultProject,
  createdAt: new Date(),
  ownerId: "owner",
  home: "example",
  description: "example",
  id: "newAndVeryUniqueID",
};

describe("add project function", () => {
  it("should add a project", async () => {
    await addProject("example", "owner");
    expect(prisma.project.create).toBeCalledTimes(1);
  });
  it("should create default tables", async () => {
    await addProject("example", "owner");
    expect(createTable).toBeCalledTimes(1);
  });
  it("should create a default admin role", async () => {
    await addProject("example", "owner");
    expect(addRole).toBeCalledTimes(1);
    expect(addUserToRole).toBeCalledTimes(1);
  });
});
