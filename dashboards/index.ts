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
