import { VariablesSchema } from "@/data/page/variables";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { calculateVariables } from "./calculate";

export const variablesRouter = createTRPCRouter({
  calculate: publicProcedure
    .meta({
      openapi: { tags: ["variables"], method: "GET", path: "/variables" },
    })
    .input(VariablesSchema)
    .output(VariablesSchema)
    .query(({ input }) => {
      return calculateVariables(input);
    }),
});
