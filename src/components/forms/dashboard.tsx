import { type Dashboard } from "@/data/dashboard/library/dashboard";
import { type Markdown } from "@/data/dashboard/library/markdown";
import { MarkdownForm } from "./markdown";

export const DashboardForm: React.FC<{
  dashboard: Dashboard;
  setLocalDashboard: (dashboard: Dashboard) => void;
}> = ({ dashboard, setLocalDashboard }) => {
  switch (dashboard.type) {
    case "markdown": {
      return (
        <MarkdownForm
          dashboard={dashboard as Markdown}
          setLocalDashboard={setLocalDashboard}
        />
      );
    }
    default: {
      return <div>Unknown dashboard type: {dashboard.type}</div>;
    }
  }
};
