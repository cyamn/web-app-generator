import "./markdown.css";

import { Parameters } from "dashboards/library/markdown";
import React from "react";
import ReactMarkdown from "react-markdown";

export const MarkdownRender: React.FC<{ parameters: Parameters }> = ({
  parameters,
}) => {
  return (
    <ReactMarkdown className="markdown">{parameters.markdown}</ReactMarkdown>
  );
};
