import React, { useState } from "react";

import { type Page } from "@/data/page";

import { Forms, Preview } from "./panels";

type GUIEditorProperties = {
  page: Page;
  setLocalPage: (page: Page) => void;
  tryAutoSaveToDatabase: () => void;
  projectName: string;
};

export const GUIEditor: React.FC<GUIEditorProperties> = ({
  page,
  setLocalPage,
  tryAutoSaveToDatabase,
  projectName,
}) => {
  const [dashboardIndex, setDashboardIndex] = useState(-1);
  function wrapSetDashboardIndex(index: number): void {
    if (index === dashboardIndex) {
      setDashboardIndex(-1);
    } else {
      setDashboardIndex(index);
      tryAutoSaveToDatabase();
    }
  }
  return (
    <div className="flex h-full flex-row">
      <div className="w-full">
        <Preview
          page={page}
          showBorders={true}
          setDashboardIndex={wrapSetDashboardIndex}
          index={dashboardIndex}
          projectName={projectName}
        />
      </div>
      {dashboardIndex !== -1 && (
        <div className="w-80 overflow-hidden">
          <Forms
            page={page}
            setLocalPage={setLocalPage}
            index={dashboardIndex}
          />
        </div>
      )}
    </div>
  );
};
