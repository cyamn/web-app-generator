import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getServerSession } from "next-auth/next";

import { TableList, TablesOverview, ViewList } from "@/components/navigation";
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
    <div className="flex h-full flex-row">
      <div className="flex h-full flex-col bg-slate-700">
        <div className="flex h-full flex-row">
          <ViewList activeView={"table"} project={project.id} />
          <div className="flex h-full w-full flex-col justify-between bg-slate-700">
            <TableList project={project.id} />
          </div>
        </div>
      </div>
      <TablesOverview project={project} />
    </div>
  );
};

export default Page;
