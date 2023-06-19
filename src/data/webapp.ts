import { z } from "zod";

import { defaultPage, PageSchema } from "./page";
import { defaultTable, moreComplexTable, TableSchema } from "./table";

export const WebAppSchema = z
  .object({
    name: z.string(),
    home: z.string(),
    pages: z.array(PageSchema),
    tables: z.array(TableSchema),
  })
  .strict();

export type WebApp = z.infer<typeof WebAppSchema>;

export const defaultWebApp: WebApp = {
  name: "webapp",
  home: "example",
  pages: [defaultPage],
  tables: [defaultTable, moreComplexTable],
};
