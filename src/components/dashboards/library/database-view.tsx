import { faTable } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { z } from "zod";

import { UpdateFunction } from "@/components/dashboards/definitions/types";
import { ParameterDataForm } from "@/components/dashboards/shared/forms/parameter-data";
import { DatabaseViewRender } from "@/components/dashboards/shared/renderers/database-view";
import {
  DatabaseParametersSchema,
  defaultDatabaseParameters,
} from "@/components/dashboards/shared/shemes/data";
import {
  defaultFormatDataParameters,
  FormatDataParametersSchema,
} from "@/components/dashboards/shared/shemes/data-format";

import { DashboardBase } from "../definitions/dashboard-base";

const ParametersSchema = z.object({
  data: DatabaseParametersSchema,
  format: FormatDataParametersSchema,
});

export type Parameters = z.infer<typeof ParametersSchema>;

export default class DatabaseViewDashboard extends DashboardBase<Parameters> {
  public render() {
    return (
      <DatabaseViewRender
        parameters={this.parameters}
        project={this.context.projectId}
      />
    );
  }

  public getControls(updateFunction: UpdateFunction<Parameters>) {
    const updateData = (data: Parameters["data"]) => {
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
    return {
      data: defaultDatabaseParameters,
      format: defaultFormatDataParameters,
    };
  }

  public static getSchema() {
    return ParametersSchema;
  }
}
