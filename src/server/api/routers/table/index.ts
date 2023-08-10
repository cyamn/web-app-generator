import { createTRPCRouter } from "@/server/api/trpc";

import { ADD } from "./add";
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
});
