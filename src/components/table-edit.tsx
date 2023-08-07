"use client";

import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";

import { Table } from "@/data/table";
import { defaultColumn } from "@/data/table/column";

// TODO: make functional

type TableEditProperties = {
  table: Table;
  columns?: Record<string, string>;
  controls?: boolean;
};

// eslint-disable-next-line max-lines-per-function
export const TableEdit: React.FC<TableEditProperties> = ({
  table: table_,
  columns,
  controls = true,
}) => {
  const [table, setTable] = React.useState(table_);

  return (
    <div className="">
      <div className="max-h-full overflow-x-auto shadow-md">
        <div className="flex flex-row">
          <table className="w-full overflow-auto text-left text-sm text-slate-500 ">
            <thead className="sticky top-0 bg-slate-50 text-xs uppercase text-slate-700">
              <tr>
                {controls && <th></th>}
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
              {table.rows.map((row, index) => (
                <tr
                  key={index}
                  className="border-b bg-white hover:bg-slate-50 "
                >
                  {controls && (
                    // delete col
                    <td className="max-w-fit border-r bg-slate-50 p-2 pl-4 text-right text-lg">
                      {index + 1}
                    </td>
                  )}
                  {table.columns.map((column) => (
                    <td
                      key={column.key}
                      className={`${controls ? "border-r" : "px-6 py-4"}`}
                    >
                      <Cell
                        value={row[column.key]?.toString() ?? ""}
                        type={column.type}
                        controls={controls}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="p-3"
            onClick={() => {
              setTable({
                ...table,
                columns: [...table.columns, defaultColumn],
              });
            }}
          >
            +
          </button>
        </div>
        <button
          className="w-full p-2"
          onClick={() => {
            setTable({
              ...table,
              rows: [
                ...table.rows,
                // empty row
                Object.fromEntries(
                  table.columns.map((column) => [column.key, ""])
                ),
              ],
            });
          }}
        >
          + Add row
        </button>
      </div>
    </div>
  );
};

type CellProperties = {
  value: string;
  type: string;
  controls: boolean;
};

const Cell: React.FC<CellProperties> = ({ value: value_, type, controls }) => {
  const [value, setValue] = React.useState(value_);

  useEffect(() => {
    setValue(value_);
  }, [value_]);

  switch (type) {
    case "number": {
      if (controls) {
        return (
          <input
            className="w-full border-none text-right font-mono"
            type="number"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
            }}
          />
        );
      }
      return <span className="text-right font-mono">{value}</span>;
    }
    case "boolean": {
      return (
        <FontAwesomeIcon
          className={`w-full px-2 text-center text-2xl 
             ${controls ? "cursor-pointer" : ""}
          `}
          icon={value === "true" ? faSquareCheck : faSquare}
          onClick={() => {
            if (!controls) return;
            setValue(value === "true" ? "false" : "true");
          }}
        />
      );
    }
    default: {
      if (controls) {
        return (
          <input
            className="w-full border-none"
            type="text"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
            }}
          />
        );
      }
      return <span>{value}</span>;
    }
  }
};
