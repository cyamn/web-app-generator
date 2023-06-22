import Editor from "@monaco-editor/react";
import React from "react";

import { type Page } from "@/data/page";

type MonacoProperties = {
  page: Page;
  trySetLocalPageFromString: (pageString: string) => void;
};

export const Monaco: React.FC<MonacoProperties> = ({
  page,
  trySetLocalPageFromString,
}) => {
  const content = JSON.stringify(page, null, 2);

  const handleChange = (content: string): void => {
    trySetLocalPageFromString(content);
  };

  return (
    <div className="h-full bg-slate-100 font-sans leading-normal tracking-normal">
      <MonacoEditor content={content} handleChange={handleChange} />
    </div>
  );
};

// ------- Helper Components -------

const options = {
  minimap: {
    enabled: false,
  },
  fontSize: 15,
};

type MonacoEditorProperties = {
  content: string;
  handleChange: (content: string) => void;
};

const MonacoEditor: React.FC<MonacoEditorProperties> = ({
  content,
  handleChange,
}) => {
  return (
    <Editor
      height="100%"
      language="json"
      options={options}
      value={content}
      onChange={(c: string | undefined) => {
        handleChange(c ?? "");
      }}
    />
  );
};
