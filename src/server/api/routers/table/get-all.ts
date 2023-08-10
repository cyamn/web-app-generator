import { z } from "zod";

import { TableSchema } from "@/data/table";
import { publicProcedure } from "@/server/api/trpc";

import { NotFoundError } from "../shared/errors";
import { deserialize } from "./shared/serialization";
import { getAll } from "./shared/table";

export const INPUT = z.string();

export const OUTPUT = z.array(
  z.object({ table: TableSchema, updatedAt: z.date() })
);

export const GETALL = publicProcedure
  .input(INPUT)
  .output(OUTPUT)
  .query(async ({ input }) => {
    const tables = await getAll(input);
    if (tables === null) throw new NotFoundError("Tables");
    return tables.map((table) => {
      return {
        table: deserialize(table),
        updatedAt: table.updatedAt,
      };
    });
  });
