import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getServerSession } from "next-auth/next";

import { Header } from "@/components/header";
import { TableList, ViewList } from "@/components/navigation";
import { TableEdit } from "@/components/table-edit";
import { Layout } from "@/layout";
import { AuthRequiredError } from "@/lib/exceptions";
import { appRouter } from "@/server/api/root";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/database";

dayjs.extend(relativeTime);

type PageProperties = {
  params: {
    projectID: string;
    table: string;
  };
};

const Page = async ({ params }: PageProperties) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthRequiredError();

  const caller = appRouter.createCaller({ prisma, session });
  const project = await caller.projects.get(params.projectID);
  const table = await caller.tables.get({
    project: project.id,
    table: params.table,
  });

  return (
    <Layout
      header={
        <Header
          project={project.id}
          item={
            <div className="flex flex-row items-center">
              <div>
                {project.name} 👉 {params.table}
              </div>
            </div>
          }
          user={session.user}
          // tabs={
          //   <Tabs
          //     mode={PageMode.Settings}
          //     base={`/${project.id}/table/${params.table}`}
          //   />
          // }
        />
      }
      sidebarLeft={
        <div className="flex h-full flex-col bg-slate-700">
          <div className="flex h-full flex-row">
            <ViewList activeView={"table"} projectName={project.id} />
            <div className="flex h-full w-full flex-col justify-between bg-slate-700">
              <TableList project={project.id} tableName={params.table} />
            </div>
          </div>
          {/* <StatusBar /> */}
        </div>
      }
      content={<TableEdit table={table} />}
    />
  );
};

export default Page;
