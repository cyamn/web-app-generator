"use client";

import React, { useEffect, useState } from "react";

import { DashboardRender } from "@/components/renderers/dashboard";
import { type Page } from "@/data/page";
import { api } from "@/utils/api";
import { hydratePage } from "@/utils/hydrate-page";

type PreviewerProperties = {
  page: Page;
  project: string;
};

export const Previewer: React.FC<PreviewerProperties> = ({ page, project }) => {
  const [localPage, setLocalPage] = useState<Page>(page);
  const [hydrated, setHydrated] = useState(false);

  const { data, isLoading, isError } = api.variables.calculate.useQuery({
    variables: page.variables ?? {},
    project,
    page,
  });

  useEffect(() => {
    setHydrated(false);
  }, [page]);

  if (!hydrated && !isLoading && !isError) {
    setHydrated(true);
    setLocalPage(hydratePage(page, data));
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
