import { vi } from "vitest";

import { defaultPage } from "@/data/page";
import { defaultProject } from "@/data/project";
import { prisma } from "@/server/database.mock";

import { addPage } from "../page/add";
import { updatePage } from "../page/update";
import { addRole } from "../roles/add";
import { InternalError } from "../shared/errors";
import { addTable } from "../table/add";
import { updateTable } from "../table/update";
import { addProject } from "./add";
import { importProjectFromJSON } from "./import"; // <--- function to test

vi.mock("@/server/database", () => {
  return {
    prisma: prisma,
  };
});

vi.mock("./add");

vi.mock("../page/add");
vi.mock("../page/update");
vi.mock("../roles/add");
vi.mock("../table/add");
vi.mock("../table/update");

afterEach(() => {
  vi.clearAllMocks();
});

beforeEach(() => {
  vi.restoreAllMocks();
});

const project = {
  ...defaultProject,
  description: "example",
  pages: [defaultPage],
  roles: [],
  tables: [],
};

const createDummyRole = function (name: string, admin: boolean) {
  return {
    name,
    users: [],
    isAdmin: admin,
  };
};

describe("import project from json function", () => {
  it("creates an new project if no project id provided", async () => {
    addProject.mockResolvedValue("someID");
    await importProjectFromJSON("owner", project, undefined);
    expect(addProject).toBeCalledTimes(1);
    expect(prisma.project.update).toBeCalledTimes(0);
  });
  it("throws error if new project could not be created", async () => {
    addProject.mockResolvedValue(undefined);
    await expect(
      (async () => {
        await importProjectFromJSON("owner", project, undefined);
      })()
    ).rejects.toThrowError(new InternalError("Failed to create project"));
  });
  it("updates existing project if id provided", async () => {
    await importProjectFromJSON("owner", project, "someID");
    expect(addProject).toBeCalledTimes(0);
    expect(prisma.project.update).toBeCalledTimes(1);
  });

  it("deletes all old roles except admin", async () => {
    await importProjectFromJSON("owner", project, "someID");
    expect(prisma.role.deleteMany).toBeCalledTimes(1);
    expect(prisma.role.deleteMany).toBeCalledWith({
      where: {
        projectId: "someID",
        isAdmin: false,
      },
    });
  });

  it("adds all non admin roles", async () => {
    addRole.mockResolvedValue("someRoleID");
    const projectWithRoles = {
      ...project,
      roles: [
        createDummyRole("admin", true),
        createDummyRole("role1", false),
        createDummyRole("role2", false),
        createDummyRole("role3", false),
      ],
    };
    await importProjectFromJSON("owner", projectWithRoles, "someID");
    expect(addRole).toBeCalledTimes(3);
  });
  it("throws error if role could not be created", async () => {
    addRole.mockResolvedValue(undefined);
    const projectWithRoles = {
      ...project,
      roles: [createDummyRole("role1", false)],
    };
    await expect(
      (async () => {
        await importProjectFromJSON("owner", projectWithRoles, "someID");
      })()
    ).rejects.toThrowError(new InternalError("Failed to create role"));
  });
  it("adds all users to their role", async () => {
    addRole.mockResolvedValue("someRoleID");
    prisma.user.findUnique.mockResolvedValue({ id: "someUserID" });
    const projectWithRoles = {
      ...project,
      roles: [
        {
          ...createDummyRole("role", false),
          users: ["user1", "user2", "user3"],
        },
      ],
    };
    await importProjectFromJSON("owner", projectWithRoles, "someID");
    expect(prisma.role.update).toBeCalledTimes(3);
  });
  it("deletes all old pages", async () => {
    await importProjectFromJSON("owner", project, "someID");
    expect(prisma.page.deleteMany).toBeCalledTimes(1);
    expect(prisma.page.deleteMany).toBeCalledWith({
      where: {
        projectId: "someID",
      },
    });
  });
  it("adds all new pages", async () => {
    await importProjectFromJSON("owner", project, "someID");
    expect(addPage).toBeCalledTimes(1);
    expect(updatePage).toBeCalledTimes(1);
    expect(updatePage).toBeCalledWith("owner", "someID", defaultPage);
  });
  it("deletes all old tables", async () => {
    await importProjectFromJSON("owner", project, "someID");
    expect(prisma.table.deleteMany).toBeCalledTimes(1);
    expect(prisma.table.deleteMany).toBeCalledWith({
      where: {
        projectId: "someID",
      },
    });
  });
  it("adds all new tables", async () => {
    addTable.mockResolvedValue("someTableID");
    const projectWithTables = {
      ...project,
      tables: [
        {
          name: "table1",
          columns: [],
          rows: [],
        },
        {
          name: "table2",
          columns: [],
          rows: [],
        },
      ],
    };
    await importProjectFromJSON("owner", projectWithTables, "someID");
    expect(addTable).toBeCalledTimes(2);
    expect(addTable).toBeCalledWith("owner", "someID", "table1");
    expect(addTable).toBeCalledWith("owner", "someID", "table2");
  });
  it("throws error if table could not be created", async () => {
    addTable.mockResolvedValue(undefined);
    const projectWithTables = {
      ...project,
      tables: [
        {
          name: "table1",
          columns: [],
          rows: [],
        },
      ],
    };
    await expect(
      (async () => {
        await importProjectFromJSON("owner", projectWithTables, "someID");
      })()
    ).rejects.toThrowError(new InternalError("Failed to create table"));
  });

  it("updates all tables with their columns and data", async () => {
    addTable.mockResolvedValue("someTableID");
    const projectWithTables = {
      ...project,
      tables: [
        {
          name: "table1",
          columns: [
            {
              key: "column1",
              type: "string",
            },
            {
              key: "column2",
              type: "number",
            },
          ],
          data: [
            ["value1", 1],
            ["value2", 2],
          ],
        },
      ],
    };
    await importProjectFromJSON("owner", projectWithTables, "someID");
    expect(updateTable).toBeCalledTimes(1);
    expect(updateTable).toBeCalledWith(
      "someID",
      "table1",
      [
        { key: "column1", type: "string" },
        { key: "column2", type: "number" },
      ],
      [
        ["value1", 1],
        ["value2", 2],
      ]
    );
  });
});
