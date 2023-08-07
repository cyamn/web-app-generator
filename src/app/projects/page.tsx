import { getServerSession } from "next-auth/next";

import { Header } from "@/components/header";
import { ProjectOverview } from "@/components/navigation/projects-overview";
import { Layout } from "@/layout";
import { AuthRequiredError } from "@/lib/exceptions";
import { appRouter } from "@/server/api/root";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/database";

const Projects = async () => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthRequiredError();

  const caller = appRouter.createCaller({ prisma, session });
  const projects = await caller.projects.listAll();

  return (
    <Layout
      header={<Header item="Apps" user={session.user} />}
      content={
        <div className="h-full bg-gradient-to-b from-slate-100 to-slate-200 px-64">
          <h1 className="py-8 text-center text-4xl font-extrabold tracking-tight text-slate-700 sm:text-[5rem]">
            Your Apps
          </h1>
          <ProjectOverview projects={projects} />
        </div>
      }
    />
  );
};

export default Projects;
