import { DashboardContext, DashboardMetaData, UpdateFunction } from "./types";

/**
 * Represents a dashboard component.
 *
 * @typeparam T - The type of parameters for the dashboard.
 */
export interface IDashboard<T> {
  /**
   * Renders the dashboard component.
   *
   * @returns A React JSX element representing the dashboard.
   */
  render: () => React.JSX.Element;

  /**
   * Gets the control elements for the dashboard.
   *
   * @param updateFunction - The function to update the dashboard state.
   * @returns A React JSX element containing the controls.
   */
  getControls: (updateFunction: UpdateFunction<T>) => React.JSX.Element;

  /**
   * Gets the current parameters of the dashboard.
   *
   * @returns The parameters of the dashboard.
   */
  getParameters: () => T;

  /**
   * The context of the dashboard.
   */
  context: DashboardContext;

  /**
   * Gets the metadata for the dashboard.
   *
   * @returns The metadata of the dashboard.
   */
  getMetaData: () => DashboardMetaData;

  /**
   * Gets the default parameters for the dashboard.
   *
   * @returns The default parameters of the dashboard.
   */
  getDefaultParameters: () => T;

  // static getSchema: () => z.ZodSchema<unknown>;
}
