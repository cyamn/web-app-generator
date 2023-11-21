"use client";

import React from "react";

import { Parameters } from "@/components/dashboards/library/database-view";
import { SkeletonTableView } from "@/components/skeletons/table-view";
import { TableView } from "@/components/table/table-view";
import { api } from "@/utils/api";

export const DatabaseViewRender: React.FC<{
  parameters: Parameters;
  project: string;
}> = ({ parameters, project }) => {
  const tableName = parameters.data.table;
  const {
    data: table,
    error,
    isError,
    isLoading,
  } = api.tables.get.useQuery({
    project,
    tableName,
    columns: Object.keys(parameters.data.columns ?? {}),
    filter: parameters.data.filter ?? undefined,
  });

  if (isError) return <div>{error.message}</div>;
  if (isLoading || table === undefined) return <SkeletonTableView />;

  const orderBy: Record<string, "asc" | "desc"> | never[] =
    parameters.format.orderBy ?? [];

  const sortedTable = {
    ...table,
    cells: table.cells.sort(sortTableRows(orderBy, table, tableName)),
  };

  return (
    <div>
      <TableView
        table={sortedTable}
        project={project}
        columns={parameters.data.columns}
        controls={parameters.format.controls}
      />
    </div>
  );
};
function sortTableRows(
  orderBy: Record<string, "asc" | "desc"> | never[],
  table: {
    columns: {
      type: "string" | "number" | "boolean" | "date" | "user";
      id: string;
      key: string;
    }[];
    id: string;
    name: string;
    cells: { value: string; id: string; row: string; col: string }[][];
  },
  tableName: string,
):
  | ((
      a: { value: string; id: string; row: string; col: string }[],
      b: { value: string; id: string; row: string; col: string }[],
    ) => number)
  | undefined {
  return (rowA, rowB) => {
    let result = 0;
    for (const [columnName, direction] of Object.entries(orderBy).reverse()) {
      const column = table.columns.find((col) => col.key === columnName);
      if (column === undefined) {
        throw new Error(
          `Column ${columnName} not found in table ${tableName}!`,
        );
      }
      const columnA = rowA.find((cell) => cell.col === column.id);
      const columnB = rowB.find((cell) => cell.col === column.id);
      if (columnA === undefined || columnB === undefined) {
        throw new Error(
          `Column ${column.key} not found in table ${tableName}!`,
        );
      }
      const cmp = castAndCompare(columnA.value, columnB.value, column.type);
      if (cmp > 0) {
        result = direction === "asc" ? 1 : -1;
      } else if (cmp < 0) {
        result = direction === "asc" ? -1 : 1;
      }
    }
    return result;
  };
}

function castAndCompare(a: string, b: string, cast: string): number {
  switch (cast) {
    case "number": {
      return Number(a) - Number(b);
    }
    case "date": {
      return Date.parse(a) - Date.parse(b);
    }
    case "boolean": {
      return Number(a) - Number(b);
    }
    default: {
      return a.localeCompare(b);
    }
  }
}
