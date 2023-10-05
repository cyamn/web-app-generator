import { Page } from "@prisma/client";
import { DashboardSchema } from "dashboards";
import { z } from "zod";

import { Page as DeserializedPage } from "@/data/page";
import { VariablesSchema } from "@/data/page/variables";

import { InternalError } from "../../shared/errors";

export type SerializedPage = Page & {
  canView: {
    role: {
      name: string;
    };
  }[];
};

export function deserialize(page_: SerializedPage): {
  page: DeserializedPage;
  updatedAt: Date;
} {
  const unsafeDashboards: unknown = JSON.parse(page_.dashboards as string);

  const parsedDashboards = z.array(DashboardSchema).safeParse(unsafeDashboards);

  if (!parsedDashboards.success) {
    throw new InternalError("Failed to parse page dashboards");
  }
  return {
    page: {
      name: page_.name,
      path: page_.path,
      variables: parseVariables(page_.variables),
      dashboards: parsedDashboards.data,
      access: {
        public: page_.public,
        canView: page_.canView.map((canView) => canView.role.name),
      },
    },
    updatedAt: page_.updatedAt,
  };
}

function parseVariables(
  unknownVariables: unknown
): z.infer<typeof VariablesSchema> {
  const stringVariables = unknownVariables as string;
  if (stringVariables === "{}") return {};
  const unsafeVariables: unknown = JSON.parse(stringVariables);

  const parsedVariables = VariablesSchema.safeParse(unsafeVariables);

  if (!parsedVariables.success) {
    throw new InternalError("Failed to parse page variables");
  }
  return parsedVariables.data;
}
