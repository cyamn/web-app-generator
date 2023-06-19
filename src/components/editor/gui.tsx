import React from "react";

import { HorizontalStack } from "@/layout";

import { Forms, Preview } from "./panels";
import { EditorProperties } from "./shared";

export const GUIEditor: React.FC<EditorProperties> = (editorProperties) => {
  return (
    <HorizontalStack>
      <div className="w-full">
        <Preview {...editorProperties} />
      </div>
      <div className="w-64">
        <Forms {...editorProperties} />
      </div>
    </HorizontalStack>
  );
};
