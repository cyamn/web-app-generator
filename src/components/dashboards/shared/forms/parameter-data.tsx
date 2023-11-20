"use client";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import { Column } from "@/data/table/column";
import { api } from "@/utils/api";

import { DatabaseParameters, Operators } from "../shemes/data";
import { TableSelection } from "./table-selection";

export type DataProperties = {
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
      <FilterSelection project={project} data={data} onSetData={onSetData} />
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

const FilterSelection: React.FC<DataProperties> = ({
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

  const filters = data.filter ?? [];

  return (
    <>
      <label
        htmlFor="columns"
        className="mb-2 block text-sm font-medium text-gray-900 "
      >
        Filters
      </label>
      <ul className="w-full rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900">
        {filters.map((filter, index) => (
          <div key={index} className="flex items-center">
            <li className="w-full rounded-t-lg border-b border-gray-200">
              <div className="flex items-center p-2">
                <select
                  id="column"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  value={filter.column}
                  onChange={(event) => {
                    onSetData({
                      ...data,
                      filter: filters.map((f, index_) =>
                        index_ === index
                          ? { ...f, column: event.target.value }
                          : f
                      ),
                    });
                  }}
                >
                  {table.columns.map((column) => (
                    <option key={column.id} value={column.key}>
                      {column.key}
                    </option>
                  ))}
                </select>
                <select
                  id="operator"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  value={filter.operator}
                  onChange={(event) => {
                    onSetData({
                      ...data,
                      filter: filters.map((f, index_) =>
                        index_ === index
                          ? { ...f, operator: event.target.value }
                          : f
                      ),
                    });
                  }}
                >
                  {Operators.map((operator) => (
                    <option key={operator} value={operator}>
                      {operator}
                    </option>
                  ))}
                </select>
                <input
                  id="value"
                  type="text"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Value"
                  value={filter.value.toString()}
                  onChange={(event) => {
                    onSetData({
                      ...data,
                      filter: filters.map((f, index_) =>
                        index_ === index
                          ? { ...f, value: event.target.value }
                          : f
                      ),
                    });
                  }}
                />
                {/* Delete button */}
                <button
                  className="rounded-b-lg border border-gray-200 bg-white px-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => {
                    onSetData({
                      ...data,
                      filter: filters.filter((_, index_) => index_ !== index),
                    });
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </li>
          </div>
        ))}
        <button
          className="w-full rounded-b-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => {
            onSetData({
              ...data,
              filter: [
                ...filters,
                {
                  column: table.columns[0]!.key,
                  operator: Operators[0],
                  value: "",
                },
              ],
            });
          }}
        >
          add filter
        </button>
      </ul>
    </>
  );
};
