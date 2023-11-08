import { Prisma } from "@prisma/client";
import { vi } from "vitest";

import { prisma } from "@/server/database.mock";

import { InternalError } from "../../shared/errors";
import { deserialize, SerializedPage } from "./serialization"; // <--- function to test

vi.mock("@/server/database", () => {
  return {
    prisma: prisma,
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

beforeEach(() => {
  vi.restoreAllMocks();
});

const page: SerializedPage = {
  id: "someID",
  projectId: "someID",
  createdAt: new Date(),
  name: "someName",
  path: "somePath",
  variables: "{}",
  dashboards: "[]",
  updatedAt: new Date(),
  public: true,
  canView: [
    {
      role: {
        name: "someName",
      },
    },
  ],
};

const defaultDashboard: object = {
  type: "markdown",
  parameters: {
    markdown: "hello world",
  },
};

describe("deserialize function", () => {
  it("should deserialize page", () => {
    const result = deserialize(page);
    expect(result.page.name).toEqual(page.name);
    expect(result.page.path).toEqual(page.path);
    expect(result.page.variables).toEqual({});
    expect(result.page.dashboards).toEqual([]);
  });

  it("should deserialize dashboards", () => {
    const dashboards = JSON.stringify([
      defaultDashboard,
    ]) as unknown as Prisma.JsonValue;
    const pageWithDashboards = {
      ...page,
      dashboards,
    };
    const result = deserialize(pageWithDashboards);
    expect(result.page.dashboards).toEqual([defaultDashboard]);
  });

  it("should throw error if dashboards are invalid", () => {
    const dashboards = JSON.stringify([
      {
        invalid: "invalid",
      },
    ]) as unknown as Prisma.JsonValue;
    const pageWithDashboards = {
      ...page,
      dashboards,
    };
    expect(() => {
      deserialize(pageWithDashboards);
    }).toThrow(new InternalError("Failed to parse page dashboards"));
  });

  it("should deserialize variables", () => {
    const variables = JSON.stringify({
      var1: "value1",
    }) as unknown as Prisma.JsonValue;
    const pageWithVariables = {
      ...page,
      variables,
    };
    const result = deserialize(pageWithVariables);
    expect(result.page.variables).toEqual({
      var1: "value1",
    });
  });

  it("should throw error if variables are invalid", () => {
    const variables = JSON.stringify([
      "invalid",
    ]) as unknown as Prisma.JsonValue;
    const pageWithVariables = {
      ...page,
      variables,
    };
    expect(() => {
      deserialize(pageWithVariables);
    }).toThrow(new InternalError("Failed to parse page variables"));
  });
});
