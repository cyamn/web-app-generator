import { getServerSession } from "next-auth/next";

import { Quickmenu } from "@/components/command";
import { Header } from "@/components/header";
import { authOptions } from "@/server/auth";
import {
  getServerSideProject,
  getServerSideProjectAdmins,
} from "@/utils/get-serverside";

type PageProperties = {
  params: {
    projectID: string;
  };
  children: React.ReactNode;
};

const Page = async ({ params, children }: PageProperties) => {
  const session = await getServerSession(authOptions);
  if (session === null) throw new Error("Unauthorized");

  const project = await getServerSideProject(params.projectID);
  if (project === null) throw new Error("Project not found");

  // check if is admin
  const projectAdmins = await getServerSideProjectAdmins(params.projectID);
  const isAdmin = projectAdmins.some((admin) => admin.id === session.user.id);
  if (!isAdmin) throw new Error("Unauthorized");

  return (
    <div className="flex h-screen w-screen flex-col overflow-auto">
      <Header
        project={project.id}
        projectName={project.name}
        item={<div className="flex flex-row items-center">{project.name}</div>}
        user={session.user}
      />
      <Quickmenu project={params.projectID} />
      {children}
    </div>
  );
};

export default Page;
