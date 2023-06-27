import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getServerSession } from "next-auth/next";

import { Header } from "@/components/header";
import { TableList, TablesOverview, ViewList } from "@/components/navigation";
import { Layout } from "@/layout";
import { AuthRequiredError } from "@/lib/exceptions";
import { authOptions } from "@/server/auth";

dayjs.extend(relativeTime);

type PageProperties = {
  params: {
    project: string;
  };
};

const Page = async ({ params }: PageProperties) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthRequiredError();

  return (
    <Layout
      header={
        <Header
          item={
            <div className="flex flex-row items-center">{params.project}</div>
          }
          user={session.user}
        />
      }
      sidebarLeft={
        <div className="flex h-full flex-col bg-slate-700">
          <div className="flex h-full flex-row">
            <ViewList activeView={"table"} projectName={params.project} />
            <div className="flex h-full w-full flex-col justify-between bg-slate-700">
              <TableList project={params.project} />
            </div>
          </div>
          {/* <StatusBar /> */}
        </div>
      }
      content={<TablesOverview project={params.project} />}
    />
  );
};

export default Page;
