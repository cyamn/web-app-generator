"use client";

import React, { useState } from "react";

import { type Page } from "@/data/page";
import { api } from "@/utils/api";

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
      mutate({ project, pagePath: localPage.path, page: localPage });
    }
  }

  return (
    <div className="flex h-full flex-row">
      <div className="w-full">
        <Preview
          page={localPage}
          showBorders={true}
          index={index}
          setIndex={switchIndex}
          projectName={project}
        />
      </div>
      {index !== -1 && (
        <div className="w-80 overflow-hidden">
          <Forms page={localPage} setLocalPage={setLocalPage} index={index} />
        </div>
      )}
    </div>
  );
};
