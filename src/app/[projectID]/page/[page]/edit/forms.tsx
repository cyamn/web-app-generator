import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dashboard } from "dashboards";
import { DashboardFactory } from "dashboards/factory";
import React from "react";

import { type Page } from "@/data/page";

type FormProperties = {
  page: Page;
  setLocalPage: (page: Page) => void;
  index?: number;
  removeDashboard: (index: number) => void;
  project: string;
};

export const Forms: React.FC<FormProperties> = ({
  page,
  setLocalPage,
  index = -1,
  removeDashboard,
  project,
}) => {
  if (
    index >= page.dashboards.length ||
    page.dashboards[index] === undefined ||
    page.dashboards[index] === null
  )
    return null;
  const dashboard: Dashboard = page.dashboards[index] as Dashboard;

  function updateDashboardParameters(parameters: unknown): void {
    const updatedPage = structuredClone(page);
    updatedPage.dashboards[index] = structuredClone(dashboard);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    updatedPage.dashboards[index].parameters = parameters;
    setLocalPage(updatedPage);
  }

  const dash = DashboardFactory(dashboard, {
    projectId: project,
  });

  return (
    <div className="flex h-full flex-col overflow-auto bg-white p-4 font-sans leading-normal tracking-normal">
      <div className="h-full">
        <h2 className="flex flex-row overflow-hidden">
          <FontAwesomeIcon
            className="pr-2 pt-1 text-2xl"
            icon={dash.getMetaData().icon}
          />
          <span className="font-mono text-xl uppercase">
            {dash.getMetaData().title}
          </span>
        </h2>
        {dash.getControls(updateDashboardParameters)}
      </div>
      <button
        onClick={() => {
          removeDashboard(index);
        }}
        className="
        w-full rounded-lg border border-red-500 bg-red-100 px-4 py-2 font-bold text-red-600 hover:bg-red-600 hover:text-white
        "
      >
        Delete
      </button>
    </div>
  );
};
