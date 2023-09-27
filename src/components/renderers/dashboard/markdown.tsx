import "./markdown.css";

import React from "react";
import ReactMarkdown from "react-markdown";

import { type Markdown } from "@/data/dashboard/library/markdown";

export const MarkdownRender: React.FC<{ dashboard: Markdown }> = ({
  dashboard,
}) => {
  return (
    <ReactMarkdown className="markdown">
      {dashboard.parameters.markdown}
    </ReactMarkdown>
  );
};
