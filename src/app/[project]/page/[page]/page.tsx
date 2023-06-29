import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Previewer } from "@/components/editor/previewer";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/server/database";

dayjs.extend(relativeTime);

type PageProperties = {
  params: {
    project: string;
    page: string;
  };
};

const Page = async ({ params }: PageProperties) => {
  const caller = appRouter.createCaller({ prisma, session: null });
  const pageWithMeta = await caller.pages.getPublic({
    project: params.project,
    page: params.page,
  });

  return <Previewer page={pageWithMeta.page} project={params.project} />;
};

export default Page;
