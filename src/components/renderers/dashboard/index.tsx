import React from "react";

import { type Dashboard } from "@/data/dashboard/library/dashboard";
import { DatabaseInputForm } from "@/data/dashboard/library/database-input-form";
import { DatabaseView } from "@/data/dashboard/library/database-view";
import { type Markdown } from "@/data/dashboard/library/markdown";

import { DatabaseInputFormRender } from "./database-input-form";
import { DatabaseViewRender } from "./database-view";
import { MarkdownRender } from "./markdown";

export const DashboardRender: React.FC<{
  dashboard: Dashboard;
  index: number;
  project: string;
}> = ({ dashboard, project }) => {
  switch (dashboard.type) {
    case "markdown": {
      return <MarkdownRender dashboard={dashboard as Markdown} />;
    }
    case "databaseView": {
      return (
        <DatabaseViewRender
          dashboard={dashboard as DatabaseView}
          project={project}
        />
      );
    }
    case "databaseInputForm": {
      return (
        <DatabaseInputFormRender
          dashboard={dashboard as DatabaseInputForm}
          project={project}
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
