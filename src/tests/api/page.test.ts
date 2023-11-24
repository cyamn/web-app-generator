import { describe, expect, it, test } from "vitest";
import { adminCaller, publicCaller } from "../helpers/trpc";
import { NotFoundError } from "@/server/api/routers/shared/errors";
import { testData } from "../helpers/reset-database";

let pageID: string;

test("should create, list, get, update, delete a page", async () => {
  pageID = await adminCaller.pages.add({
    project: testData.projectID,
    pageName: "test",
  });

  // list the pages
  const pages = await adminCaller.pages.list({
    project: testData.projectID,
  });
  expect(pages.length).greaterThan(0);
  expect(pages[0]!.name).equals("test");

  // get the page
  const page = await adminCaller.pages.get({
    project: testData.projectID,
    page: "test",
  });
  expect(page!.page!.name).equals("test");

  // update the page
  // TODO: confusing to use
  await adminCaller.pages.update({
    project: testData.projectID,
    path: "test", // needs to be old path
    page: {
      name: "test2",
      path: "test2",
      dashboards: [
        {
          type: "example",
          parameters: {},
        },
      ],
    },
  });

  // get the page again
  const page2 = await adminCaller.pages.get({
    project: testData.projectID,
    page: "test2",
  });
  expect(page2!.page.name).equals("test2");
  expect(page2!.page.dashboards.length).equals(1);
  expect(page2!.page.dashboards[0]!.type).equals("example");

  // delete the page
  await adminCaller.pages.delete({
    project: testData.projectID,
    page: "test2",
  });

  // get the page again but expect error
  await expect(
    adminCaller.pages.get({
      project: testData.projectID,
      page: "test2",
    }),
  ).rejects.toThrow(NotFoundError);
});

test("should toggle page visibility", async () => {
  pageID = await adminCaller.pages.add({
    project: testData.projectID,
    pageName: "test",
  });

  // expect error if try to fetch page without being logged in
  await expect(
    publicCaller.pages.get({
      project: testData.projectID,
      page: "test",
    }),
  ).rejects.toThrow(NotFoundError);

  // make page public
  await adminCaller.pages.update({
    project: testData.projectID,
    path: "test",
    page: {
      name: "test",
      path: "test",
      dashboards: [],
      access: {
        public: true,
      },
    },
  });

  // expect to be able to fetch page
  const page = await publicCaller.pages.get({
    project: testData.projectID,
    page: "test",
  });
  expect(page!.page!.name).equals("test");
});
