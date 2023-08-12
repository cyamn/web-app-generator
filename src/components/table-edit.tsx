"use client";

import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

import { api } from "@/utils/api";

// TODO: make functional

type TableEditProperties = {
  table: string;
  project: string;
  columns?: Record<string, string>;
  controls?: boolean;
};

// eslint-disable-next-line max-lines-per-function
export const TableEdit: React.FC<TableEditProperties> = ({
  table: table_,
  project,
  columns,
  controls = true,
}) => {
  const {
    data: table,
    isLoading,
    isError,
    error,
  } = api.tables.get.useQuery({
    project,
    table: table_,
  });

  const context = api.useContext();

  const { mutate: insert, isLoading: isInserting } =
    api.tables.insert.useMutation({
      onSuccess: () => {
        void context.tables.get.invalidate({ project, table: table_ });
        toast.success("Row added");
      },
    });

  if (isError) return <div>{error.message}</div>;
  if (isLoading || table === undefined) return <div>Loading...</div>;

  const empty: Record<string, string | number | boolean | Date> = {};

  for (const column of table.columns) {
    empty[column.key] = "";
  }

  function createRow() {
    insert({
      project,
      table: table_,
      row: empty ?? {},
    });
  }

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
              {table.cells.map((row, index) => (
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
                  {row.map((cell, id) => (
                    <td
                      key={id}
                      className={`${controls ? "border-r" : "px-6 py-4"}`}
                    >
                      <Cell
                        value={cell.value ?? "???"}
                        type={table.columns[id]?.type ?? "string"}
                        controls={controls}
                        id={cell.id}
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
              toast.success("TODO: add column");
            }}
          >
            +
          </button>
        </div>
        <button
          className="w-full p-2"
          onClick={() => {
            createRow();
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
  id: string;
};

const Cell: React.FC<CellProperties> = ({
  value: value_,
  type,
  controls,
  id,
}) => {
  const [value, setValue] = React.useState(value_);

  const { mutate: update, isLoading: isUpdating } =
    api.tables.setCell.useMutation({
      onSuccess: () => {
        toast.success("Cell updated");
      },
    });

  useEffect(() => {
    setValue(value_);
  }, [value_]);

  // when enter pressed
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      updateCell();
    }
  }

  function updateCell(customValue?: string) {
    if (customValue === null && value === value_) return;
    update({
      id,
      value: customValue ?? value,
    });
  }

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
            onKeyDown={handleKeyDown}
            onBlur={() => {
              updateCell();
            }}
          />
        );
      }
      return <span className="text-right font-mono">{value}</span>;
    }
    case "boolean": {
      return (
        <FontAwesomeIcon
          className={`w-full px-2 text-center text-2xl text-blue-500 
             ${controls ? "cursor-pointer" : ""}
          `}
          icon={value === "true" ? faSquareCheck : faSquare}
          onClick={() => {
            if (!controls) return;
            updateCell(value === "true" ? "false" : "true");
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
            onKeyDown={handleKeyDown}
            onBlur={() => {
              updateCell();
            }}
          />
        );
      }
      return <span>{value}</span>;
    }
  }
};
