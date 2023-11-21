import { Dashboards } from "@/components/dashboards";

import { DashboardBase } from "./definitions/dashboard-base";
import { IDashboard } from "./definitions/dashboard-interface";
import { DashboardContext } from "./definitions/types";

type DashboardsParameters = {
  type: string;
  parameters?: unknown;
};

export function DashboardFactory(
  parameters: DashboardsParameters,
  utils: DashboardContext,
): IDashboard<unknown> {
  const dashboard = Dashboards[parameters.type];
  if (dashboard === undefined) {
    return new DashboardBase<unknown>(utils, parameters.parameters);
  }
  const instance = new dashboard(utils, parameters.parameters);
  return instance;
}
