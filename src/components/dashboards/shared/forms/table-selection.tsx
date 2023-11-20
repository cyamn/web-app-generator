"use client";

import React from "react";

import { api } from "@/utils/api";

import { DataProperties } from "./parameter-data";

export const TableSelection: React.FC<DataProperties> = ({
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
  if (data.table === "" && tables.length > 0 && tables[0] !== undefined)
    onSetData({ ...data, table: tables[0].name });
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
