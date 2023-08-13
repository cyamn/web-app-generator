import { createTRPCRouter } from "@/server/api/trpc";

import { ADD } from "./add";
import { CREATE_CELL, SET_CELL } from "./cell";
import { ADD_COLUMN, SET_COLUMN } from "./column";
import { DELETE } from "./delete";
import { GET, TABLE_TO_CSV } from "./get";
import { GETALL } from "./get-all";
import { IMPORT } from "./import";
import { INSERT } from "./insert";
import { LIST } from "./list";

export const tablesRouter = createTRPCRouter({
  add: ADD,
  listAll: LIST,
  getAll: GETALL,
  get: GET,
  toCSV: TABLE_TO_CSV,
  insert: INSERT,
  setCell: SET_CELL,
  createCell: CREATE_CELL,
  setColumn: SET_COLUMN,
  addColumn: ADD_COLUMN,
  import: IMPORT,
  delete: DELETE,
});
