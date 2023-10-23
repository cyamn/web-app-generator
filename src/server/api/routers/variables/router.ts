import { z } from "zod";

import { PageSchema } from "@/data/page";
import { VariablesSchema } from "@/data/page/variables";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { calculateVariables } from "./calculate";

export const variablesRouter = createTRPCRouter({
  calculate: publicProcedure
    .meta({
      openapi: {
        description: "Calculate the values of variables and add internal ones",
        tags: ["variables"],
        method: "POST",
        path: "/variables/calculate",
      },
    })
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
