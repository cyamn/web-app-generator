import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Table } from "@/server/api/routers/table/schema";

type TableViewProperties = {
  table: Table;
  columns?: Record<string, string>;
};

export const TableView: React.FC<TableViewProperties> = ({
  table,
  columns,
}) => {
  return (
    <div className="">
      <div className="max-h-full overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-left text-sm text-slate-500 ">
          <thead className="sticky top-0 bg-slate-50 text-xs uppercase text-slate-700">
            <tr>
              {table.columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-6 py-3 font-medium tracking-wider"
                >
                  {columns ? columns[column.key] : column.key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="overflow-y-auto">
            {table.cells.map((row, index) => (
              <tr key={index} className="border-b bg-white hover:bg-slate-50 ">
                {row.map((cell, id) => (
                  <td key={id} className="px-6 py-4">
                    <Cell
                      value={cell.value ?? "???"}
                      type={table.columns[id]?.type ?? "string"}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

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
      return <span>{value}</span>;
    }
  }
};
