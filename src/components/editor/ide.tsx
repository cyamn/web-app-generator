"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { type Page, PageSchema } from "@/data/page";
import { useKey } from "@/hooks/use-key";
import { api } from "@/utils/api";

import { Monaco } from "./panels/monaco";
import { Previewer } from "./previewer";

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

  useEffect(() => {
    trySetLocalPageFromString(JSON.stringify(page));
  }, [page]);

  function trySetLocalPageFromString(pageString: string): void {
    let parsed: unknown;
    try {
      parsed = JSON.parse(pageString);
    } catch {
      setError(IDEError.INVALID_JSON);
      return;
    }
    const verify = PageSchema.safeParse(parsed);
    if (!verify.success) {
      setError(IDEError.INVALID_PAGE);
      return;
    }
    setLocalPage(verify.data);
    setError(IDEError.NONE);
  }

  const { mutate, isLoading: isSaving } = api.pages.update.useMutation({
    onSuccess: () => {
      // location.reload();
      toast.success(`Saved page to database!`);
    },
  });

  function trySaveToDatabase(): void {
    if (error !== IDEError.NONE) {
      toast.error("could not save page");
      return;
    }
    mutate({ project, page: localPage });
  }

  useKey("ctrls", () => {
    trySaveToDatabase();
  });

  return (
    <div className="flex h-full flex-row">
      <div className="w-1/2">
        <Monaco
          page={page}
          trySetLocalPageFromString={trySetLocalPageFromString}
        />
      </div>
      <div className="w-1/2">
        <div className="mx-5 flex justify-center bg-red-800 font-mono text-3xl text-red-300">
          {error}
        </div>
        <Previewer
          page={localPage}
          variables={localPage.variables}
          project={project}
        />
      </div>
    </div>
  );
};
