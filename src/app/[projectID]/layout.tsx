import { getServerSession } from "next-auth/next";

import { Quickmenu } from "@/components/command";
import { Header } from "@/components/header";
import { authOptions } from "@/server/auth";
import { getServerSideProject } from "@/utils/get-serverside";

type PageProperties = {
  params: {
    projectID: string;
  };
  children: React.ReactNode;
};

const Page = async ({ params, children }: PageProperties) => {
  const session = await getServerSession(authOptions);
  const project =
    session === null ? null : await getServerSideProject(params.projectID);

  return (
    <div className="flex h-screen w-screen flex-col overflow-auto">
      {session !== null && project !== null && (
        <Header
          project={project.id}
          projectName={project.name}
          item={
            <div className="flex flex-row items-center">{project.name}</div>
          }
          user={session.user}
        />
      )}
      {children}
      <Quickmenu project={params.projectID} />
    </div>
  );
};

export default Page;
