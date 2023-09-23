import React, { useEffect } from "react";

import { type Markdown } from "@/data/dashboard/library/markdown";

export const MarkdownForm: React.FC<{
  dashboard: Markdown;
  setLocalDashboard: (dashboard: Markdown) => void;
}> = ({ dashboard, setLocalDashboard }) => {
  const [markdown, setMarkdown] = React.useState("");

  useEffect(() => {
    setMarkdown(dashboard.parameters.markdown);
  }, [dashboard.parameters.markdown]);

  const onUpdateText = (value: string): void => {
    dashboard.parameters.markdown = value;
    setLocalDashboard(dashboard);
  };

  return (
    <div className="flex h-full flex-col">
      <h4 className="mb-2 block text-slate-900">Markdown</h4>
      <textarea
        id="message"
        rows={0}
        className="mb-8 h-full w-full border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-900"
        placeholder="Write markdown here..."
        value={markdown}
        onChange={(event) => {
          setMarkdown(event.target.value);
          onUpdateText(event.target.value);
        }}
      ></textarea>
    </div>
  );
};
