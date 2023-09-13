"use client";

import React from "react";

import { DatabaseParameters } from "@/data/dashboard/parameters/database-parameters";
import { Column } from "@/data/table/column";
import { api } from "@/utils/api";

type DataProperties = {
  project: string;
  data: DatabaseParameters;
  onSetData: (data: DatabaseParameters) => void;
};

export const ParameterDataForm: React.FC<DataProperties> = ({
  data,
  onSetData,
  project,
}) => {
  return (
    <>
      <h4 className="mb-2 block text-slate-900">Data</h4>
      <TableSelection project={project} data={data} onSetData={onSetData} />
      <ColumnSelection project={project} data={data} onSetData={onSetData} />
    </>
  );
};

const TableSelection: React.FC<DataProperties> = ({
  project,
  data,
  onSetData,
}) => {
  const {
    data: tables,
    error,
    isError,
    isLoading,
  } = api.tables.list.useQuery({ project });
  if (isError) return <div>{error.message}</div>;
  if (isLoading || tables === undefined) return <div>Loading...</div>;
  return (
    <>
      <label
        htmlFor="table"
        className="mb-2 block text-sm font-medium text-gray-900 "
      >
        Select table
      </label>
      <select
        id="table"
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        value={data.table}
        onChange={(event) => {
          onSetData({
            ...data,
            table: event.target.value,
          });
        }}
      >
        {tables.map((table) => (
          <option key={table.id} value={table.name}>
            {table.name}
          </option>
        ))}
      </select>
    </>
  );
};

const ColumnSelection: React.FC<DataProperties> = ({
  project,
  data,
  onSetData,
}) => {
  const {
    data: table,
    error,
    isError,
    isLoading,
  } = api.tables.get.useQuery({
    project,
    tableName: data.table,
  });

  if (isError) return <div>{error.message}</div>;
  if (isLoading || table === undefined) return <div>Loading...</div>;

  function setColumn(
    column: Column
  ): React.ChangeEventHandler<HTMLInputElement> | undefined {
    return (event) => {
      const newColumns = { ...data.columns };
      if (event.target.checked) {
        newColumns[column.key] = column.key;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete newColumns[column.key];
      }
      onSetData({
        ...data,
        columns: newColumns,
      });
    };
  }

  function changeColumnName(
    column: Column
  ): React.ChangeEventHandler<HTMLInputElement> | undefined {
    return (event) => {
      const newColumns = { ...data.columns };
      newColumns[column.key] =
        event.target.value === "" ? column.key : event.target.value;
      onSetData({
        ...data,
        columns: newColumns,
      });
    };
  }

  return (
    <>
      <label
        htmlFor="columns"
        className="mb-2 block text-sm font-medium text-gray-900 "
      >
        Select columns
      </label>
      <ul className="w-full rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900">
        {table.columns.map((column) => (
          <div key={column.key} className="flex items-center">
            <li className="w-full rounded-t-lg border-b border-gray-200">
              <div className="flex items-center p-2">
                <input
                  id={column.key}
                  type="checkbox"
                  className="mr-2 h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  checked={
                    data.columns === undefined || column.key in data.columns
                  }
                  onChange={setColumn(column)}
                />
                <input
                  disabled={
                    !(data.columns === undefined || column.key in data.columns)
                  }
                  type="text"
                  id={column.key}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder={column.key}
                  value={
                    data.columns?.[column.key] === column.key
                      ? ""
                      : data.columns?.[column.key]
                  }
                  onChange={changeColumnName(column)}
                />
              </div>
            </li>
          </div>
        ))}
      </ul>
    </>
  );
};
