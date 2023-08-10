import { z } from "zod";

import {} from "@/data/table";
import { RowSchema } from "@/data/table/row";
import { publicProcedure } from "@/server/api/trpc";

import { NotFoundError } from "../shared/errors";
import { get } from "./shared/table";
import { insert } from "./shared/table/insert";

export const INPUT = z.object({
  project: z.string(),
  table: z.string(),
  row: RowSchema,
});

export const INSERT = publicProcedure
  .input(INPUT)
  .mutation(async ({ input }) => {
    const table = await get(input.table, input.project);
    if (!table) throw new NotFoundError("table");
    await insert(table, input.row);
    return;
  });

export { TableSchema as OUTPUT } from "@/data/table";
