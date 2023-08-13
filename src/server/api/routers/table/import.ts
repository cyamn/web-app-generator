import { z } from "zod";

import { publicProcedure } from "@/server/api/trpc";

import { InternalError, NotFoundError } from "../shared/errors";
import { get } from "./shared/table";
import { importCSV } from "./shared/table/import";

export const INPUT = z.object({
  csv: z.string(),
  name: z.string(),
  project: z.string(),
  table: z.string().optional(),
});

export const OUTPUT = z.string();

export const IMPORT = publicProcedure
  .input(INPUT)
  .output(OUTPUT)
  .mutation(async ({ input }) => {
    let id;
    try {
      if (input.table !== undefined) {
        const table = await get(input.table, input.project);
        if (table) {
          id = table.id;
        } else {
          throw new NotFoundError("Table");
        }
      }
    } catch (error: unknown) {
      console.log(error);
    }

    const imported = await importCSV(input.csv, input.name, input.project, id);
    if (!imported) throw new InternalError("Failed to import CSV");
    return imported;
  });
