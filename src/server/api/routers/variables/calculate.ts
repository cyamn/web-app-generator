import { User } from "next-auth";

import { Page } from "@/data/page";
import { Variables } from "@/data/page/variables";

import { getProject } from "../project/get";
import { getRolesOfUserInProject } from "../roles/get";
import { makeParser } from "./library";

export async function calculateVariables(
  variables: Variables,
  projectId: string,
  page: Page,
  user?: User
): Promise<Variables> {
  const project = await getProject(projectId);

  let internal: object = {
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
    internal = {
      ...internal,
      user: {
        ...user,
        roles: await getRolesOfUserInProject(user.id, projectId),
      },
    };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const parser = makeParser(projectId);

  return {
    ...(await calculate({ ...internal, ...variables }, parser)),
    ...internal,
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
