import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { z } from "zod";

import { DashboardBase } from "./dashboard-base";

export type DashboardContext = {
  projectId: string;
};

export type DashboardMetaData = {
  title: string;
  icon: IconDefinition;
};

export type UpdateFunction<T> = (parameters: T) => void;

export type DashboardMap = Record<string, typeof DashboardBase<unknown>>;

// export const DashboardSchema = z.union(
//   Object.entries(Dashboards).map(([type, dashboard]) =>
//     z.object({
//       type: z.string().refine((value) => value === type),
//       parameters: dashboard.getSchema(),
//     })
//   )
// );

export const DashboardSchema = z.object({
  type: z.string(),
  parameters: z.unknown(),
});

export type DashboardDefinition = z.infer<typeof DashboardSchema>;
