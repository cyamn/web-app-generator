"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

import { Forms } from "@/app/[projectID]/page/[page]/edit/forms";
import {
  Console,
  LogMessage,
} from "@/app/[projectID]/page/[page]/json/console";
import { Monaco } from "@/app/[projectID]/page/[page]/json/monaco";
import { DashboardDefinition } from "@/components/dashboards";
import { BottomPanel } from "@/components/editor/bottom-panel/panel";
import { PageEditor } from "@/components/page/page-editor";
import { Page, PageSchema } from "@/data/page";

const defaultPage: Page = {
  path: "/",
  name: "Home",
  dashboards: [
    {
      type: "markdown",
      parameters: {
        markdown: "# Hello World!",
      },
    },
  ],
};

export const Playground = () => {
  const [page, setPage] = useState<Page>(defaultPage);
  const [localPage, setLocalPage] = useState<Page>(defaultPage);
  const [cliLog, setCliLog] = useState<LogMessage[]>([
    {
      message: "page loaded",
      type: "info",
    },
  ]);

  const [index, setIndex] = useState<number>(-1);

  function switchIndex(newIndex: number): void {
    if (index === newIndex) setIndex(-1);
    else {
      setIndex(newIndex);
    }
  }

  function addDashboard(index: number, dashboard: DashboardDefinition): void {
    const dashboards = [...localPage.dashboards];
    dashboards.splice(index, 0, dashboard);
    setPage({ ...localPage, dashboards });
    setLocalPage({ ...localPage, dashboards });
    toast.success(`Added ${dashboard.type} to ${localPage.name}!`);
  }

  function removeDashboard(index: number): void {
    const dashboards = [...localPage.dashboards];
    dashboards.splice(index, 1);
    setPage({ ...localPage, dashboards });
    setLocalPage({ ...localPage, dashboards });
    toast.success(`Removed dashboard from ${localPage.name}!`);
    setIndex(index - 1);
  }

  function addCliLog(log: string, type: string): void {
    const last = cliLog.at(-1);
    if (last?.message === log) {
      setCliLog((previous: LogMessage[]) => {
        const amount = last.amount === undefined ? 1 : last.amount + 1;
        return [...previous.slice(0, -1), { ...last, amount }];
      });
    } else
      setCliLog((previous: LogMessage[]) => [
        ...previous,
        { message: log, type },
      ]);
  }

  function trySetLocalPageFromString(pageString: string): void {
    let parsed: unknown;
    try {
      parsed = JSON.parse(pageString);
    } catch {
      addCliLog("invalid json", "error");
      return;
    }
    const verify = PageSchema.safeParse(parsed);
    if (!verify.success) {
      addCliLog(`invalid page:\n ${verify.error.message}`, "error");
      return;
    }
    setLocalPage(verify.data);
    addCliLog("page parsed successfully", "info");
  }

  return (
    <div className="flex h-full flex-row items-center justify-center p-5 pt-12">
      <div className="m-3 flex h-full w-1/2 flex-col gap-2">
        <div className="flex flex-row">
          <h2 className="font-promptBi w-full">Dsl</h2>
          <select name="" id=""></select>
        </div>
        <div className="flex h-full flex-col overflow-auto border border-slate-500 shadow-lg">
          <div className="h-2/3 overflow-y-scroll">
            <Monaco
              page={page}
              trySetLocalPageFromString={trySetLocalPageFromString}
            />
          </div>
          <div className="h-1/3 overflow-y-scroll">
            <BottomPanel
              tabNames={["Console"]}
              tabs={[<Console key={"Console"} messages={cliLog} />]}
              forceVisible={true}
            />
          </div>
        </div>
      </div>
      <div className="m-3 flex h-full w-1/2 flex-col gap-2">
        <div>
          <h2 className="font-promptBi w-full">Render</h2>
        </div>
        <div className="h-[95%] border border-slate-500 shadow-lg">
          <PageEditor
            page={localPage}
            index={index}
            setIndex={switchIndex}
            addDashboard={addDashboard}
          />
        </div>
      </div>
      <div className="m-3 flex h-full w-96 flex-col gap-2">
        <div>
          <h2 className="font-promptBi w-full">Settings</h2>
        </div>
        <div className="h-full overflow-y-scroll border border-slate-500 shadow-lg">
          <Forms
            page={localPage}
            setLocalPage={(page: Page) => {
              setLocalPage(page);
              setPage(page);
            }}
            index={index}
            removeDashboard={removeDashboard}
            project={"example"}
          />
        </div>
      </div>
    </div>
  );
};
