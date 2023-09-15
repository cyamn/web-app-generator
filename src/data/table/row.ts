import { z } from "zod";

export const RowSchema = z.record(
  z.union([z.string(), z.number(), z.boolean(), z.date()])
);

export type Row = z.infer<typeof RowSchema>;
