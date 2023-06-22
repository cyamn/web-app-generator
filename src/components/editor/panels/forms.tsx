import React from "react";

import { DashboardForm } from "@/components/forms/dashboard";
import { type Dashboard } from "@/data/dashboard/library/dashboard";
import { type Page } from "@/data/page";

type FormProperties = {
  page: Page;
  setLocalPage: (page: Page) => void;
  index?: number;
};

export const Forms: React.FC<FormProperties> = ({
  page,
  setLocalPage,
  index = -1,
}) => {
  if (
    index >= page.dashboards.length ||
    page.dashboards[index] === undefined ||
    page.dashboards[index] === null
  )
    return null;
  const dashboard: Dashboard = page.dashboards[index] as Dashboard;

  function setLocalDashboard(dashboard: Dashboard): void {
    // create deep copy of page
    const updatedPage = structuredClone(page);
    updatedPage.dashboards[index] = structuredClone(dashboard);
    setLocalPage(updatedPage);
  }

  return (
    <div className="h-full overflow-scroll bg-white p-4 font-sans leading-normal tracking-normal">
      <h2>{dashboard.type}</h2>
      <DashboardForm
        dashboard={dashboard}
        setLocalDashboard={setLocalDashboard}
      />
    </div>
  );
};
