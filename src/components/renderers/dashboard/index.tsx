import React from "react";

import { type Dashboard } from "@/data/dashboard/library/dashboard";
import { DatabaseView } from "@/data/dashboard/library/database-view";
import { type Markdown } from "@/data/dashboard/library/markdown";

import { DatabaseViewRender } from "./database-view";
import { MarkdownRender } from "./markdown";

export const DashboardRender: React.FC<{
  dashboard: Dashboard;
  index: number;
  projectName: string;
}> = ({ dashboard, projectName }) => {
  switch (dashboard.type) {
    case "markdown": {
      return <MarkdownRender dashboard={dashboard as Markdown} />;
    }
    case "databaseView": {
      return (
        <DatabaseViewRender
          dashboard={dashboard as DatabaseView}
          projectName={projectName}
        />
      );
    }
    default: {
      return (
        <div>
          Known but currently unsupported dashboard type: {dashboard.type}
        </div>
      );
    }
  }
};
