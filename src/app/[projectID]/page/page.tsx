import { getServerSession } from "next-auth/next";

import { Header } from "@/components/header";
import { PageList, PagesOverview, ViewList } from "@/components/navigation";
import { Layout } from "@/layout";
import { AuthRequiredError } from "@/lib/exceptions";
import { appRouter } from "@/server/api/root";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/database";

type PageProperties = {
  params: {
    projectID: string;
  };
};

const Page = async ({ params }: PageProperties) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthRequiredError();

  const caller = appRouter.createCaller({ prisma, session });
  const project = await caller.projects.get(params.projectID);

  return (
    <Layout
      header={
        <Header
          item={
            <div className="flex flex-row items-center">{project.name}</div>
          }
          user={session.user}
        />
      }
      sidebarLeft={
        <div className="flex h-full flex-row">
          <ViewList activeView={"page"} projectName={project.id} />
          <div className="flex h-full w-full flex-col justify-between bg-slate-700">
            <PageList project={project.id} />
          </div>
        </div>
      }
      content={<PagesOverview project={project} />}
    />
  );
};

export default Page;
