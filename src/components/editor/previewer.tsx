import React from "react";

import { DashboardRender } from "@/components/renderers/dashboard";
import { type Page } from "@/data/page";

type PreviewerProperties = {
  page: Page;
  project: string;
};

export const Previewer: React.FC<PreviewerProperties> = ({ page, project }) => {
  return (
    <div className="flex h-full flex-col overflow-auto p-8 font-sans leading-normal tracking-normal">
      {page.dashboards.map((dashboard, id) => (
        <div key={id} className="py-2">
          <DashboardRender
            dashboard={dashboard}
            index={id}
            projectName={project}
          />
        </div>
      ))}
    </div>
  );
};
