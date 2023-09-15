import { getServerSession } from "next-auth/next";
import React from "react";

import { Header } from "@/components/header";
import { Navbar } from "@/components/navbar";
import { ProjectOverview } from "@/components/navigation/projects-overview";
import { AuthRequiredError } from "@/lib/exceptions";
import { appRouter } from "@/server/api/root";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/database";

const Projects = async () => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthRequiredError();

  const caller = appRouter.createCaller({ prisma, session });
  const projects = await caller.projects.list({});

  return (
    <div className="flex h-screen flex-col">
      <Header item={<Navbar />} user={session?.user} />
      <div className="h-full overflow-auto bg-slate-100 px-12">
        <h1 className="py-8 text-center text-5xl font-bold tracking-tight text-slate-700">
          Your Projects
        </h1>
        <ProjectOverview projects={projects} />
      </div>
    </div>
  );
};

export default Projects;
