import { ColumnSchema } from "@/data/table/column";

import { InternalError } from "../../shared/errors";
import { Table as DeserializedTable } from "./schema";
import { Table as SerializedTable } from "./table/get";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deserialize(table: SerializedTable): DeserializedTable {
  const outColumns = table.columns.map((column) => {
    const col = ColumnSchema.safeParse({
      type: column.type,
      key: column.key,
    });
    if (!col.success) {
      throw new InternalError("Invalid column");
    }
    return col.data;
  });

  const outputTable: DeserializedTable = {
    name: table.name,
    columns: outColumns,
    cells: table.rows.map((row) => {
      const rowCells = row.cells.map((cell) => {
        return {
          id: cell.id,
          value: cell.value,
          key: cell.column.key, // for sorting
        };
      });
      // sort row cells to match column order
      rowCells.sort((a, b) => {
        const aIndex = outColumns.findIndex((col) => {
          return col.key === a.key;
        });
        const bIndex = outColumns.findIndex((col) => {
          return col.key === b.key;
        });
        return aIndex - bIndex;
      });

      return rowCells;
    }),
  };
  return outputTable;
}
