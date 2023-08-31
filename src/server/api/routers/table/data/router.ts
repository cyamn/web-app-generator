import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import {
  CSVDataSchema,
  projectTableColumnSchema,
} from "../../parameter-schemas";
import { NotFoundError } from "../../shared/errors";
import { get } from "../get";
import { importCSV } from "./import";
import { deserializeCSV } from "./serialization";

export const dataRouter = createTRPCRouter({
  exportCSV: publicProcedure
    .meta({
      openapi: { tags: ["table"], method: "GET", path: "/table/export/csv" },
    })
    .input(projectTableColumnSchema)
    .output(CSVDataSchema)
    .mutation(async ({ input }) => {
      const table = await get(input.tableName, input.project, input.columns);
      if (!table) throw new NotFoundError("table");
      return {
        csv: deserializeCSV(table),
        name: table.name,
      };
    }),
  importCSV: publicProcedure
    .meta({
      openapi: { tags: ["table"], method: "POST", path: "/table/import/csv" },
    })
    .input(
      z.object({
        csv: z.string(),
        name: z.string(),
        project: z.string(),
        table: z.string().optional(),
      })
    )
    .output(z.string())
    .mutation(async ({ input }) => {
      return await importCSV(input.project, input.csv, input.name, input.table);
    }),
});
