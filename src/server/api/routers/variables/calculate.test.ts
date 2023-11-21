import { expect, vi } from "vitest";

import { defaultPage } from "@/data/page";
import { defaultProject } from "@/data/project";
// import  from "@/server/__mocks__/database"; // 👈🏻 Added the mock
import { prisma } from "@/server/database.mock";

import { serializedTable } from "../table/data/serialization.test";
import { calculateVariables, getInternalVariables } from "./calculate";

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
  prisma.project.findFirst.mockResolvedValue(project);
});

const project = {
  ...defaultProject,
  createdAt: new Date(),
  ownerId: "owner",
  home: "example",
  description: "example",
};

describe("get internal variables function", () => {
  it("should show user as guest if undefined", async () => {
    const internal = (await getInternalVariables(
      defaultPage,
      defaultProject,
    )) as { user: object };
    expect(internal.user).toEqual({
      id: "undefined",
      name: "guest",
      email: "not signed in",
      image: "undefined",
      roles: [],
    });
  });
});

describe("calculate variables function", () => {
  it("should not change constants", async () => {
    const calculated = await calculateVariables(
      { a: "A", b: "B", c: "C" },
      defaultPage,
      "example",
    );
    expect(calculated.a).toBe("A");
    expect(calculated.b).toBe("B");
    expect(calculated.c).toBe("C");
  });
  it("should calculate a sum", async () => {
    const calculated = await calculateVariables(
      { sum: "=SUM(1,2)" },
      defaultPage,
      "example",
    );
    expect(calculated.sum).toBe(3);
  });
  it("should calculate a product", async () => {
    const calculated = await calculateVariables(
      { product: "=MMULT(2,3)" },
      defaultPage,
      "example",
    );
    expect(calculated.product).toBe(6);
  });
  it("should count rows of a table", async () => {
    prisma.table.findFirst.mockResolvedValue({
      ...serializedTable,
      createdAt: new Date(),
      projectId: "example",
    });
    const calculated = await calculateVariables(
      { rowsOfTable: '=COUNT_ROWS("Table")' },
      defaultPage,
      "example",
    );
    expect(calculated.rowsOfTable).toBe(1);
  });
  it("should show and error if a table was not found", async () => {
    const calculated = await calculateVariables(
      { rowsOfTable: '=COUNT_ROWS("Not existend")' },
      defaultPage,
      "example",
    );
    expect(calculated.rowsOfTable).toBe("#TABLE NOT FOUND!");
  });
  it("should get table data", async () => {
    prisma.table.findFirst.mockResolvedValue({
      ...serializedTable,
      createdAt: new Date(),
      projectId: "example",
    });
    const calculated = await calculateVariables(
      { data: '=GET_DATA("Table", "Name", 0)' },
      defaultPage,
      "example",
    );
    expect(calculated.data).toBe("John");
  });
});
