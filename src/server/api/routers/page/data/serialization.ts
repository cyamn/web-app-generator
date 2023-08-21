import { Page } from "@prisma/client";
import { z } from "zod";

import { DashboardSchema } from "@/data/dashboard/library/dashboard";
import { Page as DeserializedPage } from "@/data/page";

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
    throw new InternalError("Failed to parse page");
  }
  return {
    page: {
      name: page_.name,
      path: page_.path,
      dashboards: parsedDashboards.data,
      access: {
        public: page_.public,
        canView: page_.canView.map((canView) => canView.role.name),
      },
    },
    updatedAt: page_.updatedAt,
  };
}
