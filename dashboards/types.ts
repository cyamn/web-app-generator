import { UnknownDashboard } from "./library";

export type DashboardContext = {
  projectId: string;
};

export interface Dashboard {
  render: () => React.JSX.Element;
  update: (parameters: unknown) => void;
  getParameters: () => unknown;
  context: DashboardContext;
}

export type DashboardMap = Record<string, typeof UnknownDashboard>;
