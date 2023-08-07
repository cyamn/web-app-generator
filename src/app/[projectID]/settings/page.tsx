import { getServerSession } from "next-auth/next";

import { Header } from "@/components/header";
import { ViewList } from "@/components/navigation";
import { AppSettings } from "@/components/settings/app-settings";
import { RoleSettings } from "@/components/settings/role-settings";
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
          project={project.id}
          item={
            <div className="flex flex-row items-center">{project.name}</div>
          }
          user={session.user}
        />
      }
      sidebarLeft={
        <ViewList activeView={"settings"} projectName={project.id} />
      }
      content={
        <div className="m-4">
          <AppSettings projectID={params.projectID} />
          <br />
          <RoleSettings projectID={params.projectID} />
        </div>
      }
    />
  );
};

export default Page;
