import { type Markdown } from "@/data/dashboard/library/markdown";
import React from "react";
import ReactMarkdown from "react-markdown";

export const MarkdownRender: React.FC<{ dashboard: Markdown }> = ({
  dashboard,
}) => {
  return <ReactMarkdown>{dashboard.parameters.markdown}</ReactMarkdown>;
};
