import { faGhost } from "@fortawesome/free-solid-svg-icons";
import { Dashboard, DashboardContext } from "dashboards/types";

export class UnknownDashboard implements Dashboard {
  public context: DashboardContext;

  public render() {
    return <div>Not implemented</div>;
  }
  public update(_: unknown) {
    return;
  }
  public getParameters() {
    return {};
  }
  public constructor(parameters: unknown, context: DashboardContext) {
    this.context = context;
    this.update(parameters);
    return;
  }

  public static readonly title: string = "Unknown";
  public static readonly icon = faGhost;
}
