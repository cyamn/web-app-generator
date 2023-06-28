import React from "react";

import { DashboardForm } from "@/components/renderers/forms";
import { type Dashboard } from "@/data/dashboard/library/dashboard";
import { type Page } from "@/data/page";

type FormProperties = {
  page: Page;
  setLocalPage: (page: Page) => void;
  index?: number;
  removeDashboard: (index: number) => void;
};

export const Forms: React.FC<FormProperties> = ({
  page,
  setLocalPage,
  index = -1,
  removeDashboard,
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
    <div className="flex h-full flex-col overflow-scroll bg-white p-4 font-sans leading-normal tracking-normal">
      <div className="h-full">
        <h2>{dashboard.type}</h2>
        <DashboardForm
          dashboard={dashboard}
          setLocalDashboard={setLocalDashboard}
        />
        {/* evil looking button on bottom */}
      </div>
      <button
        onClick={() => {
          removeDashboard(index);
        }}
        className="
         w-full rounded-lg bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-800
      "
      >
        Delete
      </button>
    </div>
  );
};
