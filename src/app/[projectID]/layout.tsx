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
  const project = await getServerSideProject(
    params.projectID,
    session !== null
  );

  return (
    <div className="flex h-screen w-screen flex-col overflow-auto">
      {session !== null && project !== null && (
        <>
          <Header
            project={project.id}
            projectName={project.name}
            item={
              <div className="flex flex-row items-center">{project.name}</div>
            }
            user={session.user}
          />
          <Quickmenu project={params.projectID} />
        </>
      )}
      {children}
    </div>
  );
};

export default Page;
