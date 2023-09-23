import { prisma } from "@/server/database";

import { NotFoundError } from "../shared/errors";

export async function setPageVisibility(
  project: string,
  pagePath: string,
  shallBePublic: boolean
): Promise<string> {
  const pages = await prisma.page.updateMany({
    where: {
      path: pagePath,
      project: {
        id: project,
      },
    },
    data: {
      public: shallBePublic,
    },
  });

  if (pages === null) {
    throw new NotFoundError("Page");
  }
  return "";
}

export async function getRoleAccess(
  project: string,
  page: string
): Promise<
  Array<{
    id: string;
    name: string;
    access: boolean;
    isAdmin: boolean;
    users: Array<{
      id: string;
      name: string | null;
      image: string | null;
    }>;
  }>
> {
  const roles = await prisma.role.findMany({
    where: {
      project: {
        id: project,
      },
    },
    select: {
      id: true,
      name: true,
      isAdmin: true,
      users: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      roleAccessPages: {
        select: {
          page: {
            select: {
              path: true,
            },
          },
        },
      },
    },
  });
  return roles.map((role) => {
    return {
      name: role.name,
      id: role.id,
      users: role.users,
      isAdmin: role.isAdmin,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      access:
        role.roleAccessPages.some(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (roleAccessPage) => roleAccessPage.page.path === page
        ) || role.isAdmin,
    };
  });
}

export async function setRoleAccess(
  project: string,
  pagePath: string,
  role: string,
  access: boolean
): Promise<string> {
  const page = await prisma.page.findFirst({
    where: {
      path: pagePath,
      project: {
        id: project,
      },
    },
    select: {
      id: true,
    },
  });

  if (!page) {
    throw new NotFoundError("Page");
  }

  await (access
    ? prisma.roleAccessPage.create({
        data: {
          role: {
            connect: {
              id: role,
            },
          },
          page: {
            connect: {
              id: page.id,
            },
          },
        },
      })
    : prisma.roleAccessPage.deleteMany({
        where: {
          page: {
            id: page.id,
          },
          role: {
            id: role,
          },
        },
      }));
  return "success";
}
