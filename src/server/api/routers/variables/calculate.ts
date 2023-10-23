import { User } from "next-auth";

import { Page } from "@/data/page";
import { Variables } from "@/data/page/variables";

import { getProject } from "../project/get";
import { getRolesOfUserInProject } from "../roles/get";
import { makeParser } from "./library";

type Project = {
  name: string;
  id: string;
  createdAt: Date;
  description: string;
};

async function getInternalVariables(
  project: Project,
  page: Page,
  user?: User
): Promise<object> {
  let internalVariables: object = {
    user: {
      id: "undefined",
      name: "guest",
      email: "not signed in",
      image: "undefined",
      roles: [],
    },
    project,
    page: {
      ...page,
      dashboards: page.dashboards.length,
    },
    time: new Date().toISOString(),
  };
  if (user !== undefined)
    internalVariables = {
      ...internalVariables,
      user: {
        ...user,
        roles: await getRolesOfUserInProject(user.id, project.id),
      },
    };
  return internalVariables;
}

export async function calculateVariables(
  variables: Variables,
  projectId: string,
  page: Page,
  user?: User
): Promise<Variables> {
  const project = await getProject(projectId);
  const internalVariables = await getInternalVariables(project, page, user);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const parser = makeParser(projectId);
  const calculated = await calculate(
    { ...internalVariables, ...variables },
    parser
  );

  return {
    ...calculated,
    ...internalVariables,
  };
}

async function calculate(
  variables: Variables,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parser: any
): Promise<Variables> {
  const newVariables: Variables = {};
  for (const [key, value] of Object.entries(variables)) {
    if (typeof value === "string") {
      newVariables[key] = value.startsWith("=")
        ? await evaluate(value, variables, parser)
        : value;
    } else if (typeof value === "object" && value !== null) {
      newVariables[key] = calculate(value as Variables, parser);
    }
  }
  return newVariables;
}

async function evaluate(
  formula: string,
  variables: Variables,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parser: any
): Promise<string> {
  // replace every variable with its value in the formula if the value is evaluated already
  for (const [key, value] of Object.entries(variables)) {
    if (typeof value === "string" && !value.includes("$")) {
      formula = value.startsWith("=")
        ? formula.replaceAll(key, value.replace("=", ""))
        : formula.replaceAll(key, value);
    }
  }
  if (formula.includes("$")) return formula;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  return (await parser.parseAsync(formula.slice(1))) as string;
}
