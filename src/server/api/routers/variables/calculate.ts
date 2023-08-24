import { Variables } from "@/data/page/variables";

export function calculateVariables(variables: Variables): Variables {
  //append @server to each value
  // for (const key of Object.keys(variables)) {
  //   variables[key] = `@server:${variables[key] ?? ""}`;
  // }
  return variables;
}
