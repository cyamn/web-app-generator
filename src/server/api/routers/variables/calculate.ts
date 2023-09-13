import { User } from "next-auth";

import { Page } from "@/data/page";
import { Variables } from "@/data/page/variables";

import { getProject } from "../project/get";
import { getRolesOfUserInProject } from "../roles/get";

export async function calculateVariables(
  variables: Variables,
  projectId: string,
  page: Page,
  user: User
): Promise<Variables> {
  const project = await getProject(projectId);

  return {
    user: {
      ...user,
      roles: await getRolesOfUserInProject(user.id, projectId),
    },
    project,
    page: {
      ...page,
      dashboards: page.dashboards.length,
    },
    time: new Date().toISOString(),
    ...variables,
  };
}

export const defaultVariables = {
  user: "null",
  page: "null",
};
