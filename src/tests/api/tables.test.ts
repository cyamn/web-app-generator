import { describe, expect, it, test } from "vitest";
import { adminCaller } from "../helpers/trpc";
import { NotFoundError } from "@/server/api/routers/shared/errors";
import { testData } from "../helpers/reset-database";

let tableID: string;

test("should create, list, get, update, delete a table", async () => {
  tableID = await adminCaller.tables.add({
    project: testData.projectID,
    tableName: "test",
  });

  // list the tables
  const tables = await adminCaller.tables.list({
    project: testData.projectID,
  });
  expect(tables.length).greaterThan(0);

  // get the table
  const table = await adminCaller.tables.get({
    project: testData.projectID,
    tableName: "test",
  });
  expect(table!.name).equals("test");

  // update the table with data
  await adminCaller.tables.update({
    project: testData.projectID,
    tableName: "test",
    newName: "test2",
    columns: {
      name: "string",
    },
    data: [["A"], ["B"], ["C"]],
  });

  // get the table again
  const table2 = await adminCaller.tables.get({
    project: testData.projectID,
    tableName: "test2",
  });
  expect(table2!.name).equals("test2");
  expect(table2!.columns.length).equals(1);
  expect(table2!.columns[0]!.key).equals("name");
  expect(table2!.columns[0]!.type).equals("string");
  expect(table2!.cells.length).equals(3);
  expect(table2!.cells[0]![0]!.value).equals("A");
  expect(table2!.cells[1]![0]!.value).equals("B");
  expect(table2!.cells[2]![0]!.value).equals("C");

  // delete the table
  await adminCaller.tables.delete({
    project: testData.projectID,
    tableName: "test2",
  });

  // get the table again but expect error
  await expect(
    adminCaller.tables.get({
      project: testData.projectID,
      tableName: "test2",
    }),
  ).rejects.toThrow(NotFoundError);
});
