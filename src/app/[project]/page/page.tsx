import { getServerSession } from "next-auth/next";

import { Header } from "@/components/header";
import { PageList, PagesOverview, ViewList } from "@/components/navigation";
import { Layout } from "@/layout";
import { AuthRequiredError } from "@/lib/exceptions";
import { authOptions } from "@/server/auth";

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
        <div className="flex h-full flex-row">
          <ViewList activeView={"page"} projectName={params.project} />
          <div className="flex h-full w-full flex-col justify-between bg-slate-700">
            <PageList project={params.project} />
          </div>
        </div>
      }
      content={<PagesOverview project={params.project} />}
    />
  );
};

export default Page;
