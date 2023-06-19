import { z } from "zod";

export const PathSchema = z
  .object({
    base: z.string(),
    parameters: z.array(z.string()),
  })
  .strict();

export type Path = z.infer<typeof PathSchema>;

export const defaultPath: Path = {
  base: "example",
  parameters: [],
};
