import { type Page } from "@/data/page";
import React, { useState } from "react";

import { Forms, Preview } from "./panels";

type GUIEditorProperties = {
  page: Page;
  setLocalPage: (page: Page) => void;
  tryAutoSaveToDatabase: () => void;
};

export const GUIEditor: React.FC<GUIEditorProperties> = ({
  page,
  setLocalPage,
  tryAutoSaveToDatabase,
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
