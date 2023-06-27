import React from "react";

import { DashboardRender } from "@/components/renderers/dashboard";
import { type Page } from "@/data/page";

type PreviewerProperties = {
  page: Page;
  project: string;
};

export const Previewer: React.FC<PreviewerProperties> = ({ page, project }) => {
  return (
    <div className="flex h-full flex-col overflow-scroll p-4 font-sans leading-normal tracking-normal">
      {page.dashboards.map((dashboard, id) => (
        <DashboardRender
          key={id}
          dashboard={dashboard}
          index={id}
          projectName={project}
        />
      ))}
    </div>
  );
};
