import { describe, expect, it, test } from "vitest";
import prisma from "../helpers/prisma";
import { getCaller } from "@/utils/get-serverside";
import { appRouter } from "@/server/api/root";
import { adminCaller } from "../helpers/trpc";
import { NotFoundError } from "@/server/api/routers/shared/errors";

let projectID: string;

test("should create, list, get, update, delete a project", async () => {
  projectID = await adminCaller.projects.add({
    name: "test",
  });
  // list the projects
  const projects = await adminCaller.projects.list({});
  expect(projects.length).greaterThan(0);
  expect(projects[0]!.name).equals("test");

  // get the project
  const project = await adminCaller.projects.get({
    id: projectID,
  });
  expect(project!.name).equals("test");
  // update the project
  await adminCaller.projects.update({
    id: projectID,
    data: {
      name: "test2",
      description: "this is a test",
    },
  });
  // get the project again
  const project2 = await adminCaller.projects.get({
    id: projectID,
  });
  expect(project2!.name).equals("test2");
  expect(project2!.description).equals("this is a test");

  // delete the project
  await adminCaller.projects.delete({
    id: projectID,
  });

  // get the project again but expect error
  await expect(
    adminCaller.projects.get({
      id: projectID,
    }),
  ).rejects.toThrow(NotFoundError);
});

test("should intitialize a project correctly", async () => {
  const projectID = await adminCaller.projects.add({
    name: "test",
  });
  // should have example table "people"
  const table = await adminCaller.tables.get({
    project: projectID,
    tableName: "people",
  });
  expect(table!.name).toEqual("people");
  // should have admin role with user as member
  const roles = await adminCaller.roles.list({
    project: projectID,
  });
  expect(roles.length).toEqual(1);
  expect(roles[0]!.name).toEqual("admin");
  const adminRole = roles[0]!;
  expect(adminRole.users[0]!.name).toEqual("test");
});

test("config should be the same after importing and then exporting", async () => {
  // create
  const projectA = await adminCaller.projects.add({
    name: "A",
  });
  const projectB = await adminCaller.projects.add({
    name: "B",
  });

  // export A
  const projectExportedA = await adminCaller.projects.export({ id: projectA });
  // import into B
  await adminCaller.projects.import({
    projectID: projectB,
    project: projectExportedA,
  });
  // export B
  const projectExportedB = await adminCaller.projects.export({ id: projectB });

  expect(projectExportedA).toEqual(projectExportedB);
});
