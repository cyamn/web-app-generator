import { z } from "zod";

import { publicProcedure } from "@/server/api/trpc";

import { NotFoundError } from "../shared/errors";
import { TableSchema } from "./shared/schema";
import { deserialize, deserializeCSV } from "./shared/serialization";
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

export const OUTPUT_CSV = z.object({
  csv: z.string(),
  name: z.string(),
});

export const TABLE_TO_CSV = publicProcedure
  .input(INPUT)
  .output(OUTPUT_CSV)
  .mutation(async ({ input }) => {
    const table = await get(input.table, input.project, input.columns);
    if (!table) throw new NotFoundError("table");
    return {
      csv: deserializeCSV(table),
      name: table.name,
    };
  });
