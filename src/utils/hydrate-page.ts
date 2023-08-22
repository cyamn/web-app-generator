import { Page, PageSchema } from "@/data/page";
import { Variables } from "@/data/page/variables";

export function hydratePage(page: Page, variables: Variables): Page {
  const pageString = JSON.stringify(page);
  // e.g. $variable -> 42
  const hydratedPageString = pageString.replace(
    /\$(\w+)/g,
    (_, variableName: string) => {
      const variable = variables[variableName];
      if (variable === undefined) {
        return `{Unknown variable: ${variableName}}`;
      }
      return variable;
    }
  );

  let parsed: unknown;
  try {
    parsed = JSON.parse(hydratedPageString);
  } catch {
    return page;
  }
  const verify = PageSchema.safeParse(parsed);
  if (!verify.success) {
    return page;
  }
  return verify.data;
}
