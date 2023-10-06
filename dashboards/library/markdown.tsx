import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import { UpdateFunction } from "dashboards/definitions/types";
import React from "react";
import ReactMarkdown from "react-markdown";
import { z } from "zod";

import { DashboardBase } from "../definitions/dashboard-base";

const ParameterSchema = z
  .object({
    markdown: z.string(),
  })
  .strict();

export type Parameters = z.infer<typeof ParameterSchema>;

export default class MarkdownDashboard extends DashboardBase<Parameters> {
  public render() {
    return (
      <ReactMarkdown className="markdown">
        {this.parameters.markdown}
      </ReactMarkdown>
    );
  }

  public getMetaData() {
    return {
      title: "Markdown",
      icon: faMarkdown,
    };
  }

  public getControls(updateFunction: UpdateFunction<Parameters>) {
    return (
      <div className="flex h-full flex-col">
        <h4 className="mb-2 block text-slate-900">Markdown</h4>
        <textarea
          id="message"
          rows={0}
          className="mb-8 h-full w-full border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-900"
          placeholder="Write markdown here..."
          value={this.getParameters().markdown}
          onChange={(event) => {
            updateFunction({ markdown: event.target.value });
          }}
        ></textarea>
      </div>
    );
  }

  public getDefaultParameters() {
    return {
      markdown: "# Header\n\nParagraph",
    };
  }

  public static getSchema() {
    return ParameterSchema;
  }
}
