import { faTable } from "@fortawesome/free-solid-svg-icons";
import { UpdateFunction } from "dashboards/definitions/types";
import { ParameterDataForm } from "dashboards/shared/forms/parameter-data";
import { DatabaseViewRender } from "dashboards/shared/renderers/database-view";
import {
  DatabaseParametersSchema,
  defaultDatabaseParameters,
} from "dashboards/shared/shemes/data";
import {
  defaultFormatDataParameters,
  FormatDataParametersSchema,
} from "dashboards/shared/shemes/data-format";
import React from "react";
import { z } from "zod";

import { DashboardBase } from "../definitions/dashboard-base";

export default class DatabaseViewDashboard extends DashboardBase<DatabaseViewParameters> {
  public render() {
    return (
      <DatabaseViewRender
        parameters={this.parameters}
        project={this.context.projectId}
      />
    );
  }

  public getControls(updateFunction: UpdateFunction<DatabaseViewParameters>) {
    const updateData = (data: DatabaseViewParameters["data"]) => {
      updateFunction({
        ...this.getParameters(),
        data,
      });
    };

    return (
      <ParameterDataForm
        data={this.getParameters().data}
        onSetData={updateData}
        project={this.context.projectId}
      />
    );
  }

  public getMetaData() {
    return {
      title: "DatabaseView",
      icon: faTable,
    };
  }

  public getDefaultParameters() {
    return defaultDatabaseViewParameters;
  }

  public static getSchema() {
    return DatabaseViewParametersSchema;
  }
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
