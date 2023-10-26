import { faKeyboard } from "@fortawesome/free-solid-svg-icons";
import { z } from "zod";

import { UpdateFunction } from "@/components/dashboards/definitions/types";
import { ParameterDataForm } from "@/components/dashboards/shared/forms/parameter-data";
import { DatabaseInputFormRender } from "@/components/dashboards/shared/renderers/database-input-form";
import {
  DatabaseParametersSchema,
  defaultDatabaseParameters,
} from "@/components/dashboards/shared/shemes/data";
import {
  DatabaseInputParametersSchema,
  defaultDatabaseInputParameters,
} from "@/components/dashboards/shared/shemes/data-input";

import { DashboardBase } from "../definitions/dashboard-base";

const ParametersSchema = z.object({
  data: DatabaseParametersSchema,
  input: DatabaseInputParametersSchema,
});

export type Parameters = z.infer<typeof ParametersSchema>;

export default class DatabaseInputFormDashboard extends DashboardBase<Parameters> {
  public render() {
    return (
      <DatabaseInputFormRender
        parameters={this.getParameters()}
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
      title: "DatabaseInputForm",
      icon: faKeyboard,
    };
  }

  public getDefaultParameters() {
    return {
      data: defaultDatabaseParameters,
      input: defaultDatabaseInputParameters,
    };
  }

  public static getSchema() {
    return ParametersSchema;
  }
}
