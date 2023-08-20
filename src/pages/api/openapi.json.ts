import "swagger-ui-react/swagger-ui.css";

import type { NextApiRequest, NextApiResponse } from "next";
import { generateOpenApiDocument } from "trpc-openapi";

import { appRouter } from "../../server/api/root";

export default function handler(_: NextApiRequest, response: NextApiResponse) {
  response.status(200).send(
    generateOpenApiDocument(appRouter, {
      title: "WebAppGen API",
      description: "API for WebAppGen",
      version: "1.0.0",
      baseUrl: "http://localhost:3000/api",
      tags: ["debug", "auth", "users", "table", "page", "project"],
    })
  );
}
