import { faKeyboard } from "@fortawesome/free-solid-svg-icons";
import { UpdateFunction } from "dashboards/definitions/types";
import { ParameterDataForm } from "dashboards/shared/forms/parameter-data";
import { DatabaseInputFormRender } from "dashboards/shared/renderers/database-input-form";
import {
  DatabaseParametersSchema,
  defaultDatabaseParameters,
} from "dashboards/shared/shemes/data";
import {
  DatabaseInputParametersSchema,
  defaultDatabaseInputParameters,
} from "dashboards/shared/shemes/data-input";
import { z } from "zod";

import { DashboardBase } from "../definitions/dashboard-base";

const ParametersSchema = z.object({
  data: DatabaseParametersSchema,
  input: DatabaseInputParametersSchema,
});

type Parameters = z.infer<typeof ParametersSchema>;

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
