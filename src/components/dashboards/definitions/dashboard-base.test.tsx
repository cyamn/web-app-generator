import "@testing-library/jest-dom";

import { faGhost } from "@fortawesome/free-solid-svg-icons";
import { render } from "@testing-library/react";
import { vi } from "vitest";

import { autoGenerateController } from "@/components/dashboards/shared/forms/auto";

import { DashboardBase } from "./dashboard-base";

vi.mock("@/components/dashboards/shared/forms/auto", () => {
  return {
    autoGenerateController: vi.fn(() => <div>mockAutoGenerateController</div>),
  };
});

let dashboardBase: DashboardBase<unknown>;

const mockContext = {
  projectId: "mockProject",
  recurse: 0,
};

type MockParameters = {
  mockParameter: string;
};

const mockParameters: MockParameters = {
  mockParameter: "mockParameter",
};

beforeAll(() => {
  dashboardBase = new DashboardBase<MockParameters>(
    mockContext,
    mockParameters,
  );
});

describe("DashboardBase", () => {
  it("renders without errors", () => {
    render(dashboardBase.render());
  });
  it("returns the correct controls", () => {
    expect(dashboardBase.getControls(() => {})).toEqual(
      <div>mockAutoGenerateController</div>,
    );
    expect(autoGenerateController).toHaveBeenCalled();
    expect(autoGenerateController).toHaveBeenCalledWith(
      mockParameters,
      expect.any(Function),
    );
  });
  it("returns the correct parameters", () => {
    expect(dashboardBase.getParameters()).toEqual(mockParameters);
  });
  it("returns the correct metadata", () => {
    expect(dashboardBase.getMetaData()).toEqual({
      title: "Unknown",
      icon: faGhost,
    });
  });
});
