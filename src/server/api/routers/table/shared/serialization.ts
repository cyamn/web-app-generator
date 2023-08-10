import { Table as DeserializedTable } from "@/data/table";
import { ColumnSchema } from "@/data/table/column";

import { InternalError } from "../../shared/errors";
import { Table as SerializedTable } from "./table/get";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deserialize(table: SerializedTable): DeserializedTable {
  const outputTable: DeserializedTable = {
    name: table.name,
    columns: table.columns.map((column) => {
      const col = ColumnSchema.safeParse({
        type: column.type,
        key: column.key,
      });
      if (!col.success) {
        throw new InternalError("Invalid column");
      }
      return col.data;
    }),
    rows: table.rows.map((row) => {
      const result: { [key: string]: string } = {};
      for (const cell of row.cells) {
        const { value, column } = cell;
        const { key } = column;
        result[key] = value;
      }
      return result;
    }),
    ids: table.rows.map((row) => {
      return row.cells.map((cell) => {
        return cell.id;
      });
    }),
  };
  return outputTable;
}
