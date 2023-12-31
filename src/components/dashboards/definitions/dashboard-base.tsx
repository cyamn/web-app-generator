import { faGhost } from "@fortawesome/free-solid-svg-icons";
import { z } from "zod";

import {
  DashboardContext,
  UpdateFunction,
} from "@/components/dashboards/definitions/types";
import { autoGenerateController } from "@/components/dashboards/shared/forms/auto";

import { IDashboard } from "./dashboard-interface";

export class DashboardBase<T> implements IDashboard<T> {
  public context: DashboardContext;

  public render() {
    return <div>Not implemented</div>;
  }

  public getControls(updateFunction: UpdateFunction<T>) {
    return autoGenerateController(this.getParameters(), updateFunction);
  }

  public getParameters() {
    return this.parameters;
  }

  public getMetaData() {
    return {
      title: "Unknown",
      icon: faGhost,
    };
  }

  public getDefaultParameters(): T {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return {} as T;
  }

  public constructor(context: DashboardContext, parameters?: T) {
    this.context = context;
    this.parameters =
      parameters === undefined ? this.getDefaultParameters() : parameters;
    return;
  }

  public static getSchema(): z.ZodSchema<unknown> {
    return z.any();
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  protected parameters: T = {} as T;
}
