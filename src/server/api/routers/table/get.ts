import { z } from "zod";

import { publicProcedure } from "@/server/api/trpc";

import { NotFoundError } from "../shared/errors";
import { TableSchema } from "./shared/schema";
import { deserialize } from "./shared/serialization";
import { get } from "./shared/table";

export const INPUT = z.object({
  table: z.string(),
  project: z.string(),
  columns: z.array(z.string()).optional(),
});

export const OUTPUT = TableSchema;

export const GET = publicProcedure
  .input(INPUT)
  .output(OUTPUT)
  .query(async ({ input }) => {
    const table = await get(input.table, input.project, input.columns);
    if (!table) throw new NotFoundError("table");
    return deserialize(table);
  });
