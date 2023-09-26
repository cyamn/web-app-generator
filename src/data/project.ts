// TODO: merge with webapp

import { z } from "zod";

import { PageSchema } from "./page";

export const DProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  pages: z.array(PageSchema),
  roles: z.array(
    z.object({
      name: z.string(),
      users: z.array(z.string()),
      isAdmin: z.boolean(),
    })
  ),
  tables: z.array(
    z.object({
      name: z.string(),
      columns: z.record(z.string(), z.string()),
      data: z.array(z.array(z.string())),
    })
  ),
});

export type Project = {
  name: string;
  updatedAt: Date;
  description: string | null;
  id: string;
};
