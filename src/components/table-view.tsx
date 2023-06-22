import { Table } from "@/data/table";

type TableViewProperties = {
  table: Table;
};

// eslint-disable-next-line max-lines-per-function
export const TableView: React.FC<TableViewProperties> = ({ table }) => {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold">{table.name}</h1> */}

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
                  {column.key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="overflow-y-auto">
            {table.rows.map((row, index) => (
              <tr key={index} className="border-b bg-white hover:bg-slate-50 ">
                {table.columns.map((column) => (
                  <td key={column.key} className="px-6 py-4">
                    {row[column.key]?.toString()}
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
