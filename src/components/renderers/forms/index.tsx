import { type Dashboard } from "@/data/dashboard/library/dashboard";
import { DatabaseInputForm } from "@/data/dashboard/library/database-input-form";
import { DatabaseView } from "@/data/dashboard/library/database-view";
import { type Markdown } from "@/data/dashboard/library/markdown";

import { DatabaseInputFormForm } from "./database-input-form";
import { DatabaseViewForm } from "./database-view";
import { MarkdownForm } from "./markdown";

export const DashboardForm: React.FC<{
  dashboard: Dashboard;
  setLocalDashboard: (dashboard: Dashboard) => void;
  project: string;
}> = ({ dashboard, setLocalDashboard, project }) => {
  switch (dashboard.type) {
    case "markdown": {
      return (
        <MarkdownForm
          dashboard={dashboard as Markdown}
          setLocalDashboard={setLocalDashboard}
        />
      );
    }
    case "databaseView": {
      return (
        <DatabaseViewForm
          dashboard={dashboard as DatabaseView}
          setLocalDashboard={setLocalDashboard}
          project={project}
        />
      );
    }
    case "databaseInputForm": {
      return (
        <DatabaseInputFormForm
          dashboard={dashboard as DatabaseInputForm}
          setLocalDashboard={setLocalDashboard}
          project={project}
        />
      );
    }
    default: {
      return <div>Unknown dashboard type: {dashboard.type}</div>;
    }
  }
};
