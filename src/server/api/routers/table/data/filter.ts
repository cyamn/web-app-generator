import { TRPCError } from "@trpc/server";

import { Row } from "@/data/table/row";

import { TableFilter } from "../../parameter-schemas";
import { InternalError } from "../../shared/errors";
import { Table as DeserializedTable } from "../schema";

export function filter(
  table: DeserializedTable,
  filter: TableFilter[]
): DeserializedTable {
  let filteredTable = table;
  filter.map((filter) => {
    filteredTable = filterTable(filteredTable, filter);
  });
  return filteredTable;
}

function filterTable(table: DeserializedTable, filter: TableFilter) {
  // iterate through each row
  const filteredRows = table.cells.filter((row) => {
    const columnIndex = table.columns.findIndex((col) => {
      return col.key === filter.column;
    });
    if (columnIndex === -1) throw new InternalError("Invalid column");
    const cell = row[columnIndex];
    if (cell === undefined) throw new InternalError("Invalid column");
    return evaluateFilter(cell.value, filter.value, filter.operator);
  });
  return {
    ...table,
    cells: filteredRows,
  };
}

export function checkFilters(row: Row, filters: TableFilter[]): boolean {
  for (const filter of filters) {
    const cell = row[filter.column];
    if (cell === undefined) throw new InternalError("Invalid cell");
    if (!evaluateFilter(cell, filter.value, filter.operator)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Data was reject by filter\nViolated: "${filter.column} ${
          filter.operator
        } ${filter.value.toString()}"`,
      });
    }
  }
  return true;
}

export function evaluateFilter(
  cellValue: string | number | boolean | Date,
  filterValue: string | number | boolean | object,
  operator: string
): boolean {
  switch (operator) {
    case "eq": {
      return cellValue == filterValue;
    }
    case "neq": {
      return cellValue != filterValue;
    }
    case "gt": {
      return cellValue > filterValue;
    }
    case "gte": {
      return cellValue >= filterValue;
    }
    case "lt": {
      return cellValue < filterValue;
    }
    case "lte": {
      return cellValue <= filterValue;
    }
    default: {
      throw new InternalError("Invalid filter operator");
    }
  }
}
