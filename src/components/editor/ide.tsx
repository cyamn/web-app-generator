import React from "react";

import { Monaco, Preview } from "./panels";
import { type EditorProperties } from "./shared";

export const IDE: React.FC<EditorProperties> = (editorProperties) => {
  return (
    <div className="flex h-full flex-row">
      <div className="w-1/2">
        <Monaco {...editorProperties} />
      </div>
      <div className="w-1/2">
        <Preview {...editorProperties} />
      </div>
    </div>
  );
};
