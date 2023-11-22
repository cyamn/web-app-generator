import { Page } from "@/data/page";
import { defaultAccess } from "@/data/page/access";
import { Variables } from "@/data/page/variables";

import { hydratePage } from "./hydrate-page"; // <--- function to test

const page: Page = {
  name: "example",
  path: "example",
  access: defaultAccess,
  dashboards: [
    {
      type: "example",
      parameters: {
        variable: "$variable",
        nested: "$nested.variable",
        derived: "$derived",
      },
    },
  ],
};

const variables: Variables = {
  variable: "VARIABLE",
  nested: {
    variable: "NESTED",
  },
  derived: "DERIVED",
};

describe("hydrate page function", () => {
  it("should replace variables in page", () => {
    const result = hydratePage(page, variables);
    expect(result).toEqual({
      name: "example",
      path: "example",
      access: defaultAccess,
      dashboards: [
        {
          type: "example",
          parameters: {
            variable: "VARIABLE",
            nested: "NESTED",
            derived: "DERIVED",
          },
        },
      ],
    });
  });
  it("should not replace variables in page if variable is not found", () => {
    const result = hydratePage(page, {});
    expect(result).toEqual({
      name: "example",
      path: "example",
      access: defaultAccess,
      dashboards: [
        {
          type: "example",
          parameters: {
            variable: "{Unknown variable: variable}",
            nested: "{Unknown variable: nested.variable}",
            derived: "{Unknown variable: derived}",
          },
        },
      ],
    });
  });
});
