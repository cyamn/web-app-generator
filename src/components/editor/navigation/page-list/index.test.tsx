import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { prisma } from "@/server/database.mock";

import { PageList, PageListProperties } from "./index";

vi.mock("@/server/database", () => {
  return {
    prisma: prisma,
  };
});

vi.mock("./add-page-button", () => {
  return {
    AddPageButton: () => <div>mockAddPageButton</div>,
  };
});

vi.mock("@/utils/get-serverside", () => {
  return {
    getServerSidePageList: () => {
      return [
        {
          name: "mockPage",
          path: "mockPage",
        },
        {
          name: "mockPage2",
          path: "mockPage2",
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
  jsx = (await PageList(testProperties)) as JSX.Element;
});

const testProperties: PageListProperties = {
  project: "mockProject",
  pagePath: "mockPage",
};

describe("PageList", () => {
  it("renders without errors", () => {
    render(jsx);
  });
  it("renders the page list", () => {
    render(jsx);
    expect(screen.getByText("mockPage")).toBeInTheDocument();
    expect(screen.getByText("mockPage2")).toBeInTheDocument();
  });
  it("renders the active table", () => {
    render(jsx);
    expect(screen.getByText("mockPage")).toHaveClass("active");
  });
  it("renders the add table button", () => {
    render(jsx);
    expect(screen.getByText("mockAddPageButton")).toBeInTheDocument();
  });
});
