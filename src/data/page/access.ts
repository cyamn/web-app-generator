import { z } from "zod";

export const AccessSchema = z
  .object({
    public: z.boolean(),
    canView: z.array(z.string()).optional(),
  })
  .strict();

export type Access = z.infer<typeof AccessSchema>;

export const defaultAccess: Access = {
  public: true,
};
