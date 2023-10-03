import { faTable } from "@fortawesome/free-solid-svg-icons";
import { DashboardContext } from "dashboards/types";
import React from "react";
import { z } from "zod";

import { DatabaseViewRender } from "@/components/renderers/dashboard/database-view";

import {
  DatabaseParametersSchema,
  defaultDatabaseParameters,
  defaultFormatDataParameters,
  FormatDataParametersSchema,
} from "./shared";
import { UnknownDashboard } from "./unknown";

export default class DatabaseViewDashboard extends UnknownDashboard {
  public render() {
    return (
      <DatabaseViewRender
        parameters={this.parameters}
        project={this.context.projectId}
      />
    );
  }
  public update(parameters: DatabaseViewParameters) {
    this.parameters = parameters;
  }
  public constructor(
    parameters: DatabaseViewParameters,
    context: DashboardContext
  ) {
    super(parameters, context);
    this.update(parameters);
    return;
  }
  public static readonly title = "DatabaseView";
  public static readonly icon = faTable;
  private parameters: DatabaseViewParameters = defaultDatabaseViewParameters;
}

export const DatabaseViewParametersSchema = z.object({
  data: DatabaseParametersSchema,
  format: FormatDataParametersSchema,
});

export type DatabaseViewParameters = z.infer<
  typeof DatabaseViewParametersSchema
>;

export const defaultDatabaseViewParameters = {
  data: defaultDatabaseParameters,
  format: defaultFormatDataParameters,
};
