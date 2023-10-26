import "./markdown.css";

import React from "react";
import ReactMarkdown from "react-markdown";

import { Parameters } from "@/components/dashboards/library/markdown";

export const MarkdownRender: React.FC<{ parameters: Parameters }> = ({
  parameters,
}) => {
  return (
    <ReactMarkdown className="markdown">{parameters.markdown}</ReactMarkdown>
  );
};
