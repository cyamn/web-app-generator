import { InternalError } from "../../shared/errors";
import { Table as SerializedTable } from "../get";
import { ColumnSchema } from "../schema";
import { Table as DeserializedTable } from "../schema";

export function deserialize(table: SerializedTable): DeserializedTable {
  const columns = deserializeColumns(table);
  const cells = deserializeCells(table, columns);

  const outputTable: DeserializedTable = {
    name: table.name,
    id: table.id,
    columns,
    cells,
  };
  return outputTable;
}

export function deserializeCSV(table: SerializedTable): string {
  const deserialized = deserialize(table);
  const header = deserialized.columns.map((col) => col.key).join(",");
  const rows = deserialized.cells.map((row) => {
    return row.map((cell) => cell.value).join(",");
  });
  return [header, ...rows].join("\n");
}

function deserializeColumns(
  table: SerializedTable
): DeserializedTable["columns"] {
  return table.columns.map((column) => {
    const col = ColumnSchema.safeParse({
      type: column.type,
      key: column.key,
      id: column.id,
    });
    if (!col.success) {
      throw new InternalError("Invalid column");
    }
    return col.data;
  });
}

// TODO: this is a mess
function deserializeCells(
  table: SerializedTable,
  columns: DeserializedTable["columns"]
): DeserializedTable["cells"] {
  return table.rows.map((row) => {
    const rowCells = gatherRowCells(row, columns);

    // sort row cells to match column order
    rowCells.sort((a, b) => {
      const aIndex = columns.findIndex((col) => {
        return col.key === a.key;
      });
      const bIndex = columns.findIndex((col) => {
        return col.key === b.key;
      });
      return aIndex - bIndex;
    });

    return rowCells;
  });
}

function gatherRowCells(
  row: SerializedTable["rows"][0],
  columns: DeserializedTable["columns"]
) {
  const rowCells = row.cells.map((cell, index) => {
    const colID = columns[index % columns.length]?.id ?? "";
    return {
      id: cell.id,
      value: cell.value,
      key: cell.column.key, // for sorting
      row: row.id,
      col: cell.column.id,
    };
  });
  for (const col of columns) {
    if (!rowCells.some((cell) => cell.key === col.key)) {
      rowCells.push({
        id: "",
        value: "",
        key: col.key,
        row: row.id,
        col: col.id,
      });
    }
  }
  return rowCells;
}
