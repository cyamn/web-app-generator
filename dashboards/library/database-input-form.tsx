import { faKeyboard } from "@fortawesome/free-solid-svg-icons";
import { UpdateFunction } from "dashboards/definitions/types";
import { ParameterDataForm } from "dashboards/shared/forms/parameter-data";
import { DatabaseInputFormRender } from "dashboards/shared/renderers/database-input-form";
import {
  DatabaseParametersSchema,
  defaultDatabaseParameters,
} from "dashboards/shared/shemes/data";
import { DatabaseInputParametersSchema } from "dashboards/shared/shemes/data-input";
import { z } from "zod";

import { DashboardBase } from "../definitions/dashboard-base";

export default class DatabaseInputFormDashboard extends DashboardBase<DatabaseInputFormParameters> {
  public render() {
    return (
      <DatabaseInputFormRender
        parameters={this.getParameters()}
        project={this.context.projectId}
      />
    );
  }

  public getControls(
    updateFunction: UpdateFunction<DatabaseInputFormParameters>
  ) {
    const updateData = (data: DatabaseInputFormParameters["data"]) => {
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
    return defaultDatabaseInputFormParameters;
  }

  public static getSchema() {
    return DatabaseInputFormParametersSchema;
  }
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
