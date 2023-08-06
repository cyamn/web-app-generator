import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getServerSession, Session } from "next-auth";

import { Previewer } from "@/components/editor/previewer";
import { appRouter } from "@/server/api/root";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/database";

dayjs.extend(relativeTime);

type PageProperties = {
  params: {
    projectID: string;
    page: string;
  };
};

const Page = async ({ params }: PageProperties) => {
  const session = await getServerSession(authOptions);
  return session ? (
    <PrivatePage params={params} session={session} />
  ) : (
    <PublicPage params={params} />
  );
};

const PrivatePage = async ({
  params,
  session,
}: PageProperties & { session: Session }) => {
  const caller = appRouter.createCaller({ prisma, session });
  const project = await caller.projects.get(params.projectID);
  const pageWithMeta = await caller.pages.get({
    project: project.id,
    page: params.page,
  });

  return <Previewer page={pageWithMeta.page} project={project.id} />;
};

const PublicPage = async ({ params }: PageProperties) => {
  const caller = appRouter.createCaller({ prisma, session: null });
  const project = await caller.projects.get(params.projectID);
  const pageWithMeta = await caller.pages.getPublic({
    project: project.id,
    page: params.page,
  });

  return <Previewer page={pageWithMeta.page} project={project.id} />;
};

export default Page;
