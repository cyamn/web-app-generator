import { DashboardBase } from "./definitions/dashboard-base";
import { DashboardFactory } from "./factory"; // <--- function to test
import MarkdownDashboard from "./library/markdown";

describe("DashboardFactory function", () => {
  it("should return a dashboard instance if dashboard exists", () => {
    const result = DashboardFactory(
      { type: "markdown", parameters: { makrdown: "test" } },
      { projectId: "someID", recurse: 0 },
    );
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(MarkdownDashboard);
    expect(result.getMetaData().title).toEqual("Markdown");
  });
  it("should return a dashboard base instance if dashboard does not exist", () => {
    const result = DashboardFactory(
      { type: "someDashboard", parameters: undefined },
      { projectId: "someID", recurse: 0 },
    );
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(DashboardBase);
    expect(result.getMetaData().title).toEqual("Unknown");
  });
});
