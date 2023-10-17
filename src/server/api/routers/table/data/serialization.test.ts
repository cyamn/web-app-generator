import { InternalError } from "../../shared/errors";
import { deserialize, deserializeColumns } from "./serialization"; // Import the functions you want to test

const serializedTable = {
  name: "TestTable",
  id: "123",
  columns: [
    { type: "string", key: "Name", id: "1" },
    { type: "number", key: "Age", id: "2" },
  ],
  rows: [
    {
      cells: [
        {
          value: "John",
          column: {
            key: "Name",
            id: "1",
          },
          id: "1",
        },
        {
          value: "30",
          column: {
            key: "Age",
            id: "2",
          },
          id: "2",
        },
      ],
      id: "1",
    },
  ],
  updatedAt: new Date(),
};

const deserializedTable = {
  name: "TestTable",
  id: "123",
  columns: [
    { type: "string", key: "Name", id: "1" },
    { type: "number", key: "Age", id: "2" },
  ],
  cells: [
    [
      {
        id: "1",
        value: "John",
        key: "Name",
        row: "1",
        col: "1",
      },
      {
        id: "2",
        value: "30",
        key: "Age",
        row: "1",
        col: "2",
      },
    ],
  ],
};
describe("deserialize function", () => {
  it("should deserialize a table correctly", () => {
    const table = deserialize(serializedTable);
    expect(table).toEqual(deserializedTable);
  });
});

describe("deserializeColumns function", () => {
  it("should deserialize columns correctly", () => {
    const serializedTable = {
      name: "TestTable",
      id: "123",
      columns: [
        { type: "string", key: "Name", id: "1" },
        { type: "number", key: "Age", id: "2" },
      ],
      rows: [],
      updatedAt: new Date(),
    };

    const deserializedColumns = deserializeColumns(serializedTable);

    expect(deserializedColumns).toHaveLength(2);
    // expect(deserializedColumns[0].key).toEqual("Name");
    // expect(deserializedColumns[1].key).toEqual("Age");
  });

  it("should throw an error for an invalid column", () => {
    const serializedTable = {
      name: "InvalidTable",
      id: "456",
      columns: [{ type: "invalidType", key: "InvalidColumn", id: "3" }],
      rows: [],
      updatedAt: new Date(),
    };

    expect(() => deserializeColumns(serializedTable)).toThrow(InternalError);
  });
});
