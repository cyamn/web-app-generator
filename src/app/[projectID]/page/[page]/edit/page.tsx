import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getServerSession } from "next-auth/next";

import { GUIEditor } from "@/components/editor";
import { Header } from "@/components/header";
import { PageList, ViewList } from "@/components/navigation";
import { PageMode, Tabs } from "@/components/tabs";
import { Layout } from "@/layout";
import { AuthRequiredError } from "@/lib/exceptions";
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
  if (!session) throw new AuthRequiredError();

  const caller = appRouter.createCaller({ prisma, session });
  const project = await caller.projects.get({
    id: params.projectID,
  });
  const pageWithMeta = await caller.pages.get({
    project: project.id,
    page: params.page,
  });

  return (
    <Layout
      header={
        <Header
          project={project.id}
          projectName={project.name}
          item={
            <div className="flex flex-row items-center">
              <div>
                {project.name} 👉 {pageWithMeta.page.name}
              </div>
              <div className="pl-2 text-sm text-slate-400">
                last saved {dayjs(pageWithMeta.updatedAt).fromNow()}
              </div>
            </div>
          }
          user={session.user}
          tabs={
            <Tabs
              mode={PageMode.Edit}
              base={`/${project.id}/page/${params.page}`}
            />
          }
        />
      }
      sidebarLeft={
        <div className="flex h-full flex-row border">
          <ViewList activeView={"page"} projectName={project.id} />
          <PageList project={project.id} pagePath={pageWithMeta.page.path} />
        </div>
      }
      content={<GUIEditor project={project.id} page={pageWithMeta.page} />}
    />
  );
};

export default Page;
