import { Page, PageSchema } from "@/data/page";
import { Variables } from "@/data/page/variables";

export function hydratePage(page: Page, variables: Variables): Page {
  const pageString = JSON.stringify(page);
  const hydratedPageString = pageString.replaceAll(
    /\$([\w.]+)/g,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (_, variableName: string) => {
      let variable = variables;
      const variableNames = variableName.split(".");
      for (const name of variableNames) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        variable = variable[name];
        if (variable === undefined) {
          return `{Unknown variable: ${variableName}}`;
        }
      }
      return variable;
    },
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
