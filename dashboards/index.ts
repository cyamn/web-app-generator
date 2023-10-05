import { z } from "zod";

import DatabaseInputFormDashboard from "./library/database-input-form";
import DatabaseViewDashboard from "./library/database-view";
import MarkdownDashboard from "./library/markdown";
import VideoDashboard from "./library/video";
import { DashboardMap } from "./types";

export const Dashboards: DashboardMap = {
  video: VideoDashboard,
  markdown: MarkdownDashboard,
  databaseView: DatabaseViewDashboard,
  databaseInputForm: DatabaseInputFormDashboard,
};

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

export type Dashboard = z.infer<typeof DashboardSchema>;
