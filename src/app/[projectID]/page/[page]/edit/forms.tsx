import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import { DashboardDefinition } from "@/components/dashboards";
import { DashboardFactory } from "@/components/dashboards/factory";
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
  const dashboard: DashboardDefinition = page.dashboards[
    index
  ] as DashboardDefinition;

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
    recurse: 0,
  });

  return (
    <div className="flex h-full flex-col overflow-auto bg-white font-sans leading-normal tracking-normal">
      <h2 className="flex flex-row overflow-hidden p-4 pb-1">
        <FontAwesomeIcon
          className="pr-2 pt-1 text-2xl"
          icon={dash.getMetaData().icon}
        />
        <span className="font-mono text-xl uppercase">
          {dash.getMetaData().title}
        </span>
      </h2>
      <div className="h-full overflow-y-scroll p-4 pb-10">
        {dash.getControls(updateDashboardParameters)}
      </div>
      <div className="p-4">
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
    </div>
  );
};
