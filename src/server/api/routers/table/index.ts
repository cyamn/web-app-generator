import { createTRPCRouter } from "@/server/api/trpc";

import { ADD } from "./add";
import { CREATE_CELL, SET_CELL } from "./cell";
import { ADD_COLUMN, SET_COLUMN } from "./column";
import { GET } from "./get";
import { GETALL } from "./get-all";
import { INSERT } from "./insert";
import { LIST } from "./list";

export const tablesRouter = createTRPCRouter({
  add: ADD,
  listAll: LIST,
  getAll: GETALL,
  get: GET,
  insert: INSERT,
  setCell: SET_CELL,
  createCell: CREATE_CELL,
  setColumn: SET_COLUMN,
  addColumn: ADD_COLUMN,
});
