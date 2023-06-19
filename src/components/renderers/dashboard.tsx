import { type Dashboard } from "@/data/dashboard/library/dashboard";
import { type DatabaseView } from "@/data/dashboard/library/database-view";
import { type Markdown } from "@/data/dashboard/library/markdown";
import Link from "next/link";
import React from "react";
import { MarkdownRender } from "./markdown";

export const DashboardRenderer: React.FC<{
  dashboard: Dashboard;
  index: number;
}> = ({ dashboard, index }) => {
  return <div className={"px-3 pt-3"}>{renderDashboard(dashboard)}</div>;
};

function renderDashboard(dashboard: Dashboard): React.JSX.Element {
  switch (dashboard.type) {
    case "markdown": {
      return <MarkdownRender dashboard={dashboard as Markdown} />;
    }
    default: {
      return (
        <div>
          Known but currently unsupported dashboard type: {dashboard.type}
        </div>
      );
    }
  }
}
