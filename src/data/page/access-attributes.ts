import { z } from "zod";

import { defaultRole, RoleSchema } from "./role";

export const AccessAttributesSchema = z
  .object({
    canRead: z.array(RoleSchema),
    canWrite: z.array(RoleSchema),
  })
  .strict();

export type AccessAttributes = z.infer<typeof AccessAttributesSchema>;

export const defaultAccessAttributes: AccessAttributes = {
  canRead: [defaultRole],
  canWrite: [defaultRole],
};
