import { DashboardMap } from "./definitions/types";
import DatabaseInputFormDashboard from "./library/database-input-form";
import DatabaseViewDashboard from "./library/database-view";
import EmbedPageDashboard from "./library/embed-page";
import MarkdownDashboard from "./library/markdown";
import VideoDashboard from "./library/video";

export const Dashboards: DashboardMap = {
  video: VideoDashboard,
  markdown: MarkdownDashboard,
  databaseView: DatabaseViewDashboard,
  databaseInputForm: DatabaseInputFormDashboard,
  embedPage: EmbedPageDashboard,
};

export * from "./definitions/types";
