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
        />
      }
      sidebarLeft={
        <div className="flex h-full flex-row border">
          <ViewList activeView={"table"} projectName={project.id} />
          <TableList project={project.id} tableName={params.table} />
        </div>
      }
      content={<TableEdit table={params.table} project={params.projectID} />}
    />
  );
};

export default Page;
