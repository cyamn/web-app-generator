import { Dashboards } from "dashboards";

import { UnknownDashboard } from "./library";
import { Dashboard, DashboardContext } from "./types";

type DashboardsParameters = {
  type: string;
  parameters: unknown;
};

export function DashboardFactory(
  parameters: DashboardsParameters,
  context: DashboardContext
): Dashboard {
  const dashboard = Dashboards[parameters.type];
  if (dashboard === undefined) {
    return new UnknownDashboard(parameters.parameters, context);
  }
  const instance = new dashboard(parameters.parameters, context);
  return instance;
}
