import { Page } from "@/data/page";
import { Variables } from "@/data/page/variables";
import { prisma } from "@/server/database";

import { NotFoundError } from "../shared/errors";
import { deserialize } from "./data/serialization";
import { hydratePage } from "./hydrate";

const pageSelector = {
  id: true,
  projectId: true,
  createdAt: true,
  name: true,
  path: true,
  variables: true,
  dashboards: true,
  updatedAt: true,
  public: true,
  canView: {
    select: {
      role: {
        select: {
          name: true,
        },
      },
    },
  },
};

export async function getAllPages(
  userID: string,
  projectID: string
): Promise<
  {
    page: Page;
    updatedAt: Date;
  }[]
> {
  const pages = await prisma.page.findMany({
    where: {
      project: {
        ownerId: userID,
        id: projectID,
      },
    },
    select: pageSelector,
  });

  return pages.map((page) => {
    return deserialize(page);
  });
}

export async function getPage(
  userID: string,
  projectID: string,
  pagePath: string
): Promise<{
  page: Page;
  updatedAt: Date;
  variables: Variables;
}> {
  const page = await prisma.page.findFirst({
    where: {
      path: pagePath,
      projectId: projectID,
      OR: [
        {
          project: {
            ownerId: userID,
          },
        },
        {
          public: true,
        },
        {
          canView: {
            some: {
              role: {
                users: {
                  some: {
                    id: userID,
                  },
                },
              },
            },
          },
        },
      ],
    },
    select: pageSelector,
  });

  if (!page) {
    throw new NotFoundError("Page");
  }

  return hydratePage(deserialize(page));
}

export async function getPublicPage(
  projectID: string,
  pagePath: string
): Promise<{
  page: Page;
  updatedAt: Date;
  variables: Variables;
}> {
  const page = await prisma.page.findFirst({
    where: {
      path: pagePath,
      projectId: projectID,
      public: true,
    },
    select: pageSelector,
  });

  if (!page) {
    throw new NotFoundError("Page");
  }

  return hydratePage(deserialize(page));
}
