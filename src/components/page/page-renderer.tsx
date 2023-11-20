"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { DashboardFactory } from "@/components/dashboards/factory";
import { type Page } from "@/data/page";
import { api } from "@/utils/api";
import { hydratePage } from "@/utils/hydrate-page";

type PageRendererProperties = {
  page: Page;
  project?: string;
  recurse?: number;
};

export const PageRenderer: React.FC<PageRendererProperties> = ({
  page,
  project,
  recurse = 0,
}) => {
  const [localPage, setLocalPage] = useState<Page>(page);
  const [hydrated, setHydrated] = useState(false);
  const searchParameters = useSearchParams();

  let overwrittenVariables: Record<string, unknown> = {};
  if (page.variables !== undefined && searchParameters !== null) {
    overwrittenVariables = page.variables;
    Object.keys(page.variables).map((key) => {
      const parameter = searchParameters.get(key);
      if (parameter !== null) {
        overwrittenVariables[key] = parameter;
      }
    });
  }

  const { data, isLoading, isError } = api.variables.calculate.useQuery({
    variables: overwrittenVariables,
    project,
    page,
  });

  useEffect(() => {
    setHydrated(false);
  }, [page]);

  if (recurse > 10) {
    return <></>;
  }

  if (!hydrated && !isLoading && !isError) {
    setHydrated(true);
    setLocalPage(hydratePage(page, data));
  }

  return (
    <div className="flex h-full flex-col overflow-auto font-sans leading-normal tracking-normal">
      {localPage.dashboards.map((dashboard, id) => {
        const dash = DashboardFactory(dashboard, {
          projectId: project ?? "",
          recurse: recurse + 1,
        });
        return (
          <div key={id} className="py-2">
            {dash.render()}
          </div>
        );
      })}
    </div>
  );
};
