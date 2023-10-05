import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

import { UnknownDashboard } from "./library/unknown";

export type DashboardContext = {
  projectId: string;
};

export type DashboardMetaData = {
  title: string;
  icon: IconDefinition;
};

export type UpdateFunction<T> = (parameters: T) => void;

export interface Dashboard<T> {
  render: () => React.JSX.Element;
  getControls: (updateFunction: UpdateFunction<T>) => React.JSX.Element;
  getParameters: () => T;
  context: DashboardContext;
  getMetaData: () => DashboardMetaData;
  getDefaultParameters: () => T;

  // static getSchema: () => z.ZodSchema<unknown>;
}

export type DashboardMap = Record<string, typeof UnknownDashboard<unknown>>;
