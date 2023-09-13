import FormulaParser from "fast-formula-parser";
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

  const internal = {
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
  };

  return {
    ...calculate({ ...internal, ...variables }),
    ...internal,
  };
}

function calculate(variables: Variables): Variables {
  const newVariables: Variables = {};
  for (const [key, value] of Object.entries(variables)) {
    if (typeof value === "string") {
      if (value.startsWith("=")) {
        newVariables[key] = evaluate(value, variables);
      }
      newVariables[key] = value;
    } else if (typeof value === "object" && value !== null) {
      newVariables[key] = calculate(value as Variables);
    }
  }
  return newVariables;
}
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const parser = new FormulaParser();

function evaluate(formula: string, variables: Variables): string {
  // replace every variable with its value in the formula if the value is evaluated already
  for (const [key, value] of Object.entries(variables)) {
    if (typeof value === "string" && !value.includes("$")) {
      formula = value.startsWith("=")
        ? formula.replaceAll(key, value.replace("=", ""))
        : formula.replaceAll(key, value);
    }
  }
  if (formula.includes("$")) return formula;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return parser.parse(formula.slice(1)) as string;
}

export const defaultVariables = {
  user: "null",
  page: "null",
};
