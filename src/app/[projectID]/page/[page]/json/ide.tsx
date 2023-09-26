"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { BottomPanel } from "@/components/bottom-panel/panel";
import { Previewer } from "@/components/renderers/page-renderer";
import { type Page, PageSchema } from "@/data/page";
import { useKey } from "@/hooks/use-key";
import { api } from "@/utils/api";

import { Console, LogMessage } from "./console";
import { Monaco } from "./monaco";

export enum IDEError {
  NONE = "",
  INVALID_JSON = "invalid json",
  INVALID_PAGE = "invalid page",
}

type IDEProperties = {
  page: Page;
  project: string;
};

export const IDE: React.FC<IDEProperties> = ({ page, project }) => {
  const [localPage, setLocalPage] = useState<Page>(page);
  const [error, setError] = useState<IDEError>(IDEError.NONE);
  const [cliLog, setCliLog] = useState<LogMessage[]>([
    {
      message: "page loaded",
      type: "info",
    },
  ]);

  function addCliLog(log: string, type: string): void {
    const last = cliLog[cliLog.length - 1];
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

  useEffect(() => {
    trySetLocalPageFromString(JSON.stringify(page));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function trySetLocalPageFromString(pageString: string): void {
    let parsed: unknown;
    try {
      parsed = JSON.parse(pageString);
    } catch {
      setError(IDEError.INVALID_JSON);
      addCliLog("invalid json", "error");
      return;
    }
    const verify = PageSchema.safeParse(parsed);
    if (!verify.success) {
      setError(IDEError.INVALID_PAGE);
      addCliLog(`invalid page:\n ${verify.error.message}`, "error");
      return;
    }
    setLocalPage(verify.data);
    addCliLog("page parsed successfully", "info");
    setError(IDEError.NONE);
  }

  const { mutate } = api.pages.update.useMutation({
    onSuccess: () => {
      toast.success(`Saved page to database!`);
    },
  });

  function trySaveToDatabase(): void {
    if (error !== IDEError.NONE) {
      toast.error("could not save page check console");
      return;
    }
    mutate({ project, page: localPage });
    addCliLog("page saved successfully", "success");
  }

  useKey("ctrls", () => {
    trySaveToDatabase();
  });

  return (
    <div className="flex h-full flex-row">
      <div className="h-full w-1/2 overflow-auto bg-green-500">
        <Monaco
          page={page}
          trySetLocalPageFromString={trySetLocalPageFromString}
        />
      </div>
      <div className="flex w-1/2 flex-col">
        <Previewer page={localPage} project={project} />
        <BottomPanel
          tabNames={["Console"]}
          tabs={[<Console key={"Console"} messages={cliLog} />]}
        />
      </div>
    </div>
  );
};
