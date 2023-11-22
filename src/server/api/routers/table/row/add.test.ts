import cuid from "cuid";
import { vi } from "vitest";

import { prisma } from "@/server/database.mock";

import { InternalError } from "../../shared/errors";
import { createCells } from "../cell/add";
import { Table } from "../get";
import { addRow, createEmptyRow, createRows, getColumnIDs } from "./add"; // <--- function to test

vi.mock("@/server/database", () => {
  return {
    prisma: prisma,
  };
});

vi.mock("cuid", () => {
  return {
    default: vi.fn(() => "someID"),
  };
});

vi.mock("../cell/add");

afterEach(() => {
  vi.clearAllMocks();
});

beforeEach(() => {
  vi.restoreAllMocks();
  prisma.column.findFirst.mockResolvedValue({
    id: "someID",
    key: "someKey",
    type: "text",
    isRequired: true,
    isPrimary: false,
    isUnique: false,
    tableId: "someTableID",
  });
});

const table: Table = {
  name: "someTable",
  columns: [
    {
      type: "text",
      key: "someKey",
      id: "someID",
    },
  ],
  id: "someID",
  rows: [],
  updatedAt: new Date(),
};

describe("createEmptyRow function", () => {
  it("should create an empty row", async () => {
    const result = await createEmptyRow(table);
    expect(prisma.row.create).toBeCalledTimes(1);
    expect(cuid).toBeCalledTimes(1);
    expect(result).toEqual("someID");
  });
});

describe("getColumnIDs function", () => {
  it("should return an array of column ids", async () => {
    const result = await getColumnIDs(table);
    expect(result).toEqual({
      someKey: "someID",
    });
  });
  it("should throw an error if column does not exist", async () => {
    prisma.column.findFirst.mockResolvedValue(null);
    await expect(
      (async () => {
        await getColumnIDs(table);
      })(),
    ).rejects.toThrow(new InternalError("Column not found"));
  });
});

describe("createRows function", () => {
  it("should create rows", async () => {
    const result = await createRows([{ someKey: "someValue" }], "table");
    expect(prisma.row.createMany).toHaveBeenCalledTimes(1);
    expect(cuid).toHaveBeenCalledTimes(1);
    expect(result).toEqual(["someID"]);
  });
});

describe("addRow function", () => {
  it("should add a row", async () => {
    const result = await addRow(table, { someKey: "someValue" });
    expect(prisma.row.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual("someID");
    expect(createCells).toHaveBeenCalledTimes(1);
  });
});
