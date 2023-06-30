import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Previewer } from "@/components/editor/previewer";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/server/database";

dayjs.extend(relativeTime);

type PageProperties = {
  params: {
    projectID: string;
    page: string;
  };
};

const Page = async ({ params }: PageProperties) => {
  const caller = appRouter.createCaller({ prisma, session: null });
  const project = await caller.projects.get(params.projectID);
  const pageWithMeta = await caller.pages.getPublic({
    project: project.id,
    page: params.page,
  });

  return <Previewer page={pageWithMeta.page} project={project.id} />;
};

export default Page;
