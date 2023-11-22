import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { prisma } from "@/server/database.mock";

import { TableList, TableListProperties } from "./index";

vi.mock("@/server/database", () => {
  return {
    prisma: prisma,
  };
});

vi.mock("./add-table-button", () => {
  return {
    AddTableButton: () => <div>mockAddTableButton</div>,
  };
});

vi.mock("@/utils/get-serverside", () => {
  return {
    getServerSideTableList: async (project: string) => {
      return [
        {
          name: "mockTable",
          columns: [],
        },
        {
          name: "mockTable2",
          columns: [],
        },
      ];
    },
  };
});

vi.mock("@/components/editor/navigation/shared/list-item", () => {
  return {
    ListItem: ({ name, active }: { name: string; active: boolean }) => (
      <div className={active ? "active" : ""}>{name}</div>
    ),
  };
});

let jsx: JSX.Element;
beforeEach(async () => {
  // @ts-ignore
  jsx = (await TableList(testProperties)) as JSX.Element;
});

const testProperties: TableListProperties = {
  project: "mockProject",
  tableName: "mockTable",
};

describe("TableList", () => {
  it("renders without errors", () => {
    render(jsx);
  });
  it("renders the table list", () => {
    render(jsx);
    expect(screen.getByText("mockTable")).toBeInTheDocument();
    expect(screen.getByText("mockTable2")).toBeInTheDocument();
  });
  it("renders the active table", () => {
    render(jsx);
    expect(screen.getByText("mockTable")).toHaveClass("active");
  });
  it("renders the add table button", () => {
    render(jsx);
    expect(screen.getByText("mockAddTableButton")).toBeInTheDocument();
  });
});
