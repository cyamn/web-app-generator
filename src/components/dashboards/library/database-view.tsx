import { faTable } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { z } from "zod";

import { UpdateFunction } from "@/components/dashboards/definitions/types";
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
import { ParameterDataForm } from "../shared/forms/parameter-data";
import { ParameterFormatForm } from "../shared/forms/parameter-format";

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
    const updateFormatData = (
      data: Parameters["data"],
      format: Parameters["format"],
    ) => {
      updateFunction({
        ...this.getParameters(),
        data,
        format,
      });
    };

    return (
      <div className="flex flex-col">
        <ParameterDataForm
          data={this.getParameters().data}
          onSetData={updateData}
          project={this.context.projectId}
        />
        <ParameterFormatForm
          data={this.getParameters().data}
          format={this.getParameters().format}
          onSetData={updateFormatData}
          project={this.context.projectId}
        />
      </div>
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
