import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Column, Table } from "@/server/api/routers/table/schema";

import { TableControls } from "./table-controls";

type TableViewProperties = {
  table: Table;
  project: string;
  columns?: Record<string, string>;
  controls?: Record<string, string | null>;
};

export const TableView: React.FC<TableViewProperties> = ({
  table,
  project,
  columns,
  controls = {},
}) => {
  return (
    <div className="max-h-full overflow-x-auto rounded-lg shadow-md">
      <table className="w-full table-auto text-left text-sm text-slate-500">
        <thead className="sticky top-0 bg-slate-50 text-xs uppercase text-slate-700">
          <tr>
            {table.columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="whitespace-nowrap px-6 py-3 font-medium tracking-wider"
              >
                {columns ? columns[column.key] : column.key}
              </th>
            ))}
            <th className="w-full"></th>
            {/* controls */}
            {Object.values(controls).map((control) => (
              <th key={control} scope="col"></th>
            ))}
          </tr>
        </thead>
        <tbody className="overflow-y-auto">
          {table.cells.map((row, index) => (
            <tr
              key={index}
              className="w-full border-b bg-white hover:bg-slate-50 "
            >
              {row.map((cell, id) => (
                <td key={id} className="px-6 py-4">
                  <Cell
                    value={cell.value ?? "???"}
                    type={table.columns[id]?.type ?? "string"}
                  />
                </td>
              ))}
              <td className="w-full"></td>
              {Object.entries(controls).map((control) => (
                <td key={control[0]}>
                  <TableControls
                    project={project}
                    table={table}
                    control={control}
                    rowID={row[0]!.row}
                    rowData={rowsToRecord(row, table.columns)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

type Cell = {
  id: string;
  value: string;
  col: string;
  row: string;
};

function rowsToRecord(row: Cell[], columns: Column[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const cell of row) {
    const column = columns.find((col) => col.id === cell.col);
    if (column === undefined) throw new Error("Column not found");
    result[column.key] = cell.value;
  }
  return result;
}

type CellProperties = {
  value: string;
  type: string;
};

const Cell: React.FC<CellProperties> = ({ value, type }) => {
  switch (type) {
    case "number": {
      return <span className="text-right font-mono">{value}</span>;
    }
    case "boolean": {
      return (
        <FontAwesomeIcon
          className={`w-full px-2 text-center text-2xl 
          `}
          icon={value === "true" ? faSquareCheck : faSquare}
        />
      );
    }
    default: {
      return <span className="whitespace-nowrap">{value}</span>;
    }
  }
};
