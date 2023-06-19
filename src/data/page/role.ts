import { z } from "zod";

// TODO: fill stub
export const RoleSchema = z.string();

export type Role = z.infer<typeof RoleSchema>;

export const defaultRole: Role = "user";
