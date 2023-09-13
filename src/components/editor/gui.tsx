"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

import { Dashboard } from "@/data/dashboard/library/dashboard";
import { type Page } from "@/data/page";
import { Variables } from "@/data/page/variables";
import { useKey } from "@/hooks/use-key";
import { api } from "@/utils/api";
import { deepEqual } from "@/utils/deep-equal";

import { BottomPanel } from "./bottom-panel/panel";
import { VariablesPanel } from "./bottom-panel/variables-panel";
import { Forms, Preview } from "./panels";

type GUIEditorProperties = {
  page: Page;
  project: string;
  index?: number;
};

export const GUIEditor: React.FC<GUIEditorProperties> = ({ page, project }) => {
  const [localPage, setLocalPage] = useState<Page>(page);
  const { mutate } = api.pages.update.useMutation();

  const [index, setIndex] = useState<number>(-1);

  function switchIndex(newIndex: number): void {
    if (index === newIndex) setIndex(-1);
    else {
      setIndex(newIndex);
      if (!deepEqual(localPage, page)) {
        toast.success(`Saved page to database!`);
        mutate({ project, page: localPage });
      }
    }
  }

  function addDashboard(index: number, dashboard: Dashboard): void {
    const dashboards = [...localPage.dashboards];
    dashboards.splice(index, 0, dashboard);
    setLocalPage({ ...localPage, dashboards });
    toast.success(`Added ${dashboard.type} to ${localPage.name}!`);
    mutate({ project, page: localPage });
  }

  function removeDashboard(index: number): void {
    const dashboards = [...localPage.dashboards];
    dashboards.splice(index, 1);
    setLocalPage({ ...localPage, dashboards });
    toast.success(`Removed dashboard from ${localPage.name}!`);
    mutate({ project, page: localPage });
    setIndex(index - 1);
  }

  function updateVariables(variables: Variables): void {
    setLocalPage({ ...localPage, variables });
    mutate({ project, page: { ...localPage, variables } });
  }

  useKey("ctrls", () => {
    toast.success(`Saved page to database!`);
    mutate({ project, page: localPage });
  });

  return (
    <div className="flex h-full flex-row overflow-auto">
      <div className="w-full">
        <div className="flex h-full flex-col">
          <Preview
            page={localPage}
            showBorders={true}
            index={index}
            setIndex={switchIndex}
            project={project}
            addDashboard={addDashboard}
          />
          <BottomPanel
            tabNames={["Variables"]}
            tabs={[
              <VariablesPanel
                key={"Variables"}
                variables={{ ...page.variables }}
                updateVariables={updateVariables}
                page={page}
                project={project}
              />,
            ]}
          />
        </div>
      </div>
      {index !== -1 && (
        <div className="w-80 overflow-hidden border-l border-slate-300">
          <Forms
            page={localPage}
            setLocalPage={setLocalPage}
            index={index}
            removeDashboard={removeDashboard}
            project={project}
          />
        </div>
      )}
    </div>
  );
};
