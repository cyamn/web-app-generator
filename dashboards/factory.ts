import { Dashboards } from "dashboards";

import { UnknownDashboard } from "./library/unknown";
import { Dashboard, DashboardContext } from "./types";

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
    return new UnknownDashboard<unknown>(context, parameters.parameters);
  }
  const instance = new dashboard(context, parameters.parameters);
  return instance;
}
