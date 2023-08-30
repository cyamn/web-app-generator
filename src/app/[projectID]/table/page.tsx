import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getServerSession } from "next-auth/next";

import { Header } from "@/components/header";
import { TableList, TablesOverview, ViewList } from "@/components/navigation";
import { Layout } from "@/layout";
import { AuthRequiredError } from "@/lib/exceptions";
import { appRouter } from "@/server/api/root";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/database";

dayjs.extend(relativeTime);

type PageProperties = {
  params: {
    projectID: string;
  };
};

const Page = async ({ params }: PageProperties) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthRequiredError();

  const caller = appRouter.createCaller({ prisma, session });
  const project = await caller.projects.get({ id: params.projectID });

  return (
    <Layout
      header={
        <Header
          project={project.id}
          item={
            <div className="flex flex-row items-center">{project.name}</div>
          }
          user={session.user}
        />
      }
      sidebarLeft={
        <div className="flex h-full flex-col bg-slate-700">
          <div className="flex h-full flex-row">
            <ViewList activeView={"table"} project={project.id} />
            <div className="flex h-full w-full flex-col justify-between bg-slate-700">
              <TableList project={project.id} />
            </div>
          </div>
          {/* <StatusBar /> */}
        </div>
      }
      content={<TablesOverview project={project} />}
    />
  );
};

export default Page;
