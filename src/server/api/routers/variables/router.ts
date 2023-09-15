import { z } from "zod";

import { PageSchema } from "@/data/page";
import { VariablesSchema } from "@/data/page/variables";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { calculateVariables } from "./calculate";

export const variablesRouter = createTRPCRouter({
  calculate: publicProcedure
    .input(
      z.object({
        variables: VariablesSchema,
        page: PageSchema,
        project: z.string(),
      })
    )
    .output(VariablesSchema)
    .query(async ({ ctx, input }) => {
      return await calculateVariables(
        input.variables,
        input.project,
        input.page,
        ctx.session === null ? undefined : ctx.session.user
      );
    }),
});
