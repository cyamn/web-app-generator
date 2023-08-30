"use client";

import React, { useEffect, useState } from "react";

import { DashboardRender } from "@/components/renderers/dashboard";
import { type Page } from "@/data/page";
import { Variables } from "@/data/page/variables";
import { api } from "@/utils/api";
import { hydratePage } from "@/utils/hydrate-page";

type PreviewerProperties = {
  page: Page;
  project: string;
  variables?: Variables;
};

export const Previewer: React.FC<PreviewerProperties> = ({
  page,
  project,
  variables = {},
}) => {
  const [localPage, setLocalPage] = useState<Page>(page);

  const { data, isLoading, isError } =
    api.variables.calculate.useQuery(variables);

  useEffect(() => {
    loadPage(page);
  }, [page]);

  function loadPage(page: Page): void {
    let variables_ = variables;
    if (!isLoading && !isError) {
      variables_ = data;
    }
    setLocalPage(hydratePage(page, variables_));
  }

  return (
    <div className="flex h-full flex-col overflow-auto p-8 font-sans leading-normal tracking-normal">
      {localPage.dashboards.map((dashboard, id) => (
        <div key={id} className="py-2">
          <DashboardRender dashboard={dashboard} index={id} project={project} />
        </div>
      ))}
    </div>
  );
};
