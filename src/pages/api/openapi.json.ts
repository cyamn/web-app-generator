import "swagger-ui-react/swagger-ui.css";

import type { NextApiRequest, NextApiResponse } from "next";
import { generateOpenApiDocument } from "trpc-openapi";

import { name, version } from "@/../package.json";
import { getNextUrl } from "@/utils/get-next-url";

import { appRouter } from "../../server/api/root";

export default function handler(_: NextApiRequest, response: NextApiResponse) {
  response.status(200).send(
    generateOpenApiDocument(appRouter, {
      title: `Rest API endpoints for ${name}`,
      description:
        "Read examples how to consume the API endpoints here: TODO or try them out headers.",
      version,
      baseUrl: `${getNextUrl()}/api`,
      tags: ["debug", "project", "page", "table", "role"],
    })
  );
}
