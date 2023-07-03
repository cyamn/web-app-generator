import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import { faKeyboard, faTable } from "@fortawesome/free-solid-svg-icons";
import { z } from "zod";

import { DatabaseInputFormSchema } from "./database-input-form";
import { DatabaseViewSchema } from "./database-view";
import { MarkdownSchema } from "./markdown";

export const DashboardSchema = z.union([
  MarkdownSchema,
  DatabaseInputFormSchema,
  DatabaseViewSchema,
]);

export type Dashboard = z.infer<typeof DashboardSchema>;

export { defaultMarkdown as defaultDashboard } from "./markdown";

// dictionary of dashboard types to icons
export const DashboardTypeToIcon = {
  markdown: faMarkdown,
  databaseView: faTable,
  databaseInputForm: faKeyboard,
};
