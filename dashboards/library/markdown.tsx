import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import { DashboardContext } from "dashboards/types";
import React from "react";
import ReactMarkdown from "react-markdown";
import { z } from "zod";

import { UnknownDashboard } from "./unknown";

export default class MarkdownDashboard extends UnknownDashboard {
  public render() {
    return (
      <ReactMarkdown className="markdown">
        {this.parameters.markdown}
      </ReactMarkdown>
    );
  }
  public update(parameters: MarkdownParameters) {
    this.parameters = parameters;
  }
  public constructor(
    parameters: MarkdownParameters,
    context: DashboardContext
  ) {
    super(parameters, context);
    this.update(parameters);
    return;
  }
  public static readonly title = "Markdown";
  public static readonly icon = faMarkdown;
  private parameters: MarkdownParameters = defaultMarkdownParameters;
}

export const MarkdownParametersSchema = z
  .object({
    markdown: z.string(),
  })
  .strict();

export type MarkdownParameters = z.infer<typeof MarkdownParametersSchema>;

export const defaultMarkdownParameters = {
  markdown: "# Header\n\nParagraph",
};
