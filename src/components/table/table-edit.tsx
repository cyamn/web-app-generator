"use client";

import React from "react";
import toast from "react-hot-toast";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { api } from "@/utils/api";
import { internalToName } from "@/utils/internal-to-name";
import { nameToInternal } from "@/utils/name-to-internal";

import { CellEdit } from "./cell-edit";
import { ColumnHeader } from "./column-header";

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
    tableName: table_,
  });

  const context = api.useContext();

  const { mutate: insert } = api.tables.row.add.useMutation({
    onSuccess: () => {
      void context.tables.get.invalidate({ project, tableName: table_ });
      toast.success("Row added");
    },
  });

  const { mutate: addColumn } = api.tables.column.add.useMutation({
    onSuccess: () => {
      void context.tables.get.invalidate({ project, tableName: table_ });
      toast.success("Column added");
    },
  });

  const { mutate: deleteRow } = api.tables.row.delete.useMutation({
    onSuccess: () => {
      void context.tables.get.invalidate({ project, tableName: table_ });
      toast.success("Column deleted");
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
      tableName: table_,
      row: empty ?? {},
    });
  }

  function createColumn() {
    if (table === undefined) return;
    // count columns
    const count = table.columns.length + 1 ?? 1;
    const name = `Column ${count}`;
    const key = nameToInternal(name);

    addColumn({
      tableID: table.id,
      key,
      type: "string",
    });
  }

  return (
    <div className="z-10 flex flex-col border-l border-slate-300 shadow-md">
      <div className="flex w-max flex-row overflow-auto">
        <table className="table-auto text-left text-sm text-slate-500">
          <thead className="sticky top-0 bg-slate-50 text-xs uppercase text-slate-700">
            <tr>
              {controls && <th></th>}
              {table.columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="border-slate-300 bg-slate-50 py-2 font-medium tracking-wider"
                >
                  <ColumnHeader
                    value={internalToName(
                      (columns ? columns[column.key] : column.key) ?? ""
                    )}
                    column={column}
                    project={project}
                    table={table_}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="overflow-y-auto">
            {table.cells.map((row, index) => (
              <tr
                key={index}
                className="border-b border-slate-300 bg-white hover:bg-slate-50 "
              >
                {controls && (
                  // delete col
                  <td className="w-max border-r bg-slate-100 text-right text-lg">
                    <ContextMenu>
                      <ContextMenuTrigger className="w-max p-2 px-5 pl-4">
                        {index + 1}
                      </ContextMenuTrigger>
                      <ContextMenuContent className="w-64 bg-white">
                        <ContextMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            deleteRow({
                              rowId: row[0]?.row ?? "",
                            });
                          }}
                        >
                          Delete
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </td>
                )}
                {row.map((cell, id) => (
                  <td
                    key={id}
                    className={`${
                      controls ? "border-r border-slate-300" : "px-6 py-4"
                    }`}
                  >
                    <CellEdit
                      value={cell.value ?? "???"}
                      type={table.columns[id]?.type ?? "string"}
                      controls={controls}
                      id={cell.id}
                      cell={cell}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="mt-14 bg-white p-2 shadow-md [writing-mode:vertical-lr]"
          onClick={() => {
            createColumn();
          }}
        >
          + Add column
        </button>
      </div>
      <button
        className="w-full bg-white p-2"
        onClick={() => {
          createRow();
        }}
      >
        + Add row
      </button>
    </div>
  );
};
