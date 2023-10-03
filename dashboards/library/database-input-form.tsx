import { faTable } from "@fortawesome/free-solid-svg-icons";
import { DashboardContext } from "dashboards/types";
import React from "react";
import { z } from "zod";

import { DatabaseInputFormRender } from "@/components/renderers/dashboard/database-input-form";

import {
  DatabaseInputParametersSchema,
  DatabaseParametersSchema,
  defaultDatabaseParameters,
} from "./shared";
import { UnknownDashboard } from "./unknown";

export default class DatabaseInputFormDashboard extends UnknownDashboard {
  public render() {
    return (
      <DatabaseInputFormRender
        parameters={this.parameters}
        project={this.context.projectId}
      />
    );
  }
  public update(parameters: DatabaseInputFormParameters) {
    this.parameters = parameters;
  }
  public constructor(
    parameters: DatabaseInputFormParameters,
    context: DashboardContext
  ) {
    super(parameters, context);
    this.update(parameters);
    return;
  }
  public static readonly title = "DatabaseInputForm";
  public static readonly icon = faTable;
  private parameters: DatabaseInputFormParameters =
    defaultDatabaseInputFormParameters;
}

export const DatabaseInputFormParametersSchema = z.object({
  data: DatabaseParametersSchema,
  input: DatabaseInputParametersSchema,
});

export type DatabaseInputFormParameters = z.infer<
  typeof DatabaseInputFormParametersSchema
>;

export const defaultDatabaseInputFormParameters: DatabaseInputFormParameters = {
  data: defaultDatabaseParameters,
  input: {
    mode: "create",
  },
};
