import "./markdown.css";

import { MarkdownParameters } from "dashboards/library/markdown";
import React from "react";
import ReactMarkdown from "react-markdown";

export const MarkdownRender: React.FC<{ parameters: MarkdownParameters }> = ({
  parameters,
}) => {
  return (
    <ReactMarkdown className="markdown">{parameters.markdown}</ReactMarkdown>
  );
};
