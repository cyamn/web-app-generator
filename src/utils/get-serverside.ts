import { getServerSession } from "next-auth";

import { AuthRequiredError } from "@/lib/exceptions";
import { appRouter } from "@/server/api/root";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/database";

async function getCaller(needsAuth = true) {
  const session = await getServerSession(authOptions);
  if (needsAuth && !session) throw new AuthRequiredError();
  return appRouter.createCaller({ prisma, session });
}

export async function getServerSidePage(
  project: string,
  page: string,
  needsAuth = true
) {
  const c = await getCaller(needsAuth);
  return c.pages.get({
    project,
    page,
  });
}

export async function getServerSideProject(project: string, needsAuth = true) {
  const c = await getCaller(needsAuth);
  return c.projects.get({
    id: project,
  });
}
