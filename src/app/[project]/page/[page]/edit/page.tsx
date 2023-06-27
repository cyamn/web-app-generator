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
    project: string;
    page: string;
  };
};

const Page = async ({ params }: PageProperties) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthRequiredError();

  const caller = appRouter.createCaller({ prisma, session });
  const pageWithMeta = await caller.pages.get({
    project: params.project,
    page: params.page,
  });

  return (
    <Layout
      header={
        <Header
          item={
            <div className="flex flex-row items-center">
              <div>
                {params.project} 👉 {pageWithMeta.page.name}
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
              base={`/${params.project}/page/${params.page}`}
            />
          }
        />
      }
      sidebarLeft={
        <div className="flex h-full flex-row">
          <ViewList activeView={"page"} projectName={params.project} />
          <PageList
            project={params.project}
            pagePath={pageWithMeta.page.path}
          />
        </div>
      }
      content={<GUIEditor project={params.project} page={pageWithMeta.page} />}
    />
  );
};

export default Page;
