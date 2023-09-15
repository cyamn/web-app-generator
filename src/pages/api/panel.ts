import type { NextApiRequest, NextApiResponse } from "next";
import { renderTrpcPanel } from "trpc-panel";

import { getNextUrl } from "@/utils/get-next-url";

import { appRouter } from "../../server/api/root";

export default function handler(_: NextApiRequest, response: NextApiResponse) {
  response.status(200).send(
    renderTrpcPanel(appRouter, {
      url: `${getNextUrl()}/api/trpc`,
      transformer: "superjson",
    })
  );
}
