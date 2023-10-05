import { Dashboards } from "dashboards";

import { DashboardBase } from "./definitions/dashboard-base";
import { Dashboard, DashboardContext } from "./definitions/types";

type DashboardsParameters = {
  type: string;
  parameters?: unknown;
};

export function DashboardFactory(
  parameters: DashboardsParameters,
  context: DashboardContext
): Dashboard<unknown> {
  const dashboard = Dashboards[parameters.type];
  if (dashboard === undefined) {
    return new DashboardBase<unknown>(context, parameters.parameters);
  }
  const instance = new dashboard(context, parameters.parameters);
  return instance;
}
