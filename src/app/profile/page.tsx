import { getServerSession } from "next-auth/next";
import React from "react";

import { UserAvatar } from "@/components/avatars/user";
import { Header } from "@/components/header";
import { Navbar } from "@/components/navbar";
import { Layout } from "@/layout";
import { AuthRequiredError } from "@/lib/exceptions";
import { appRouter } from "@/server/api/root";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/database";

const Projects = async () => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthRequiredError();

  const caller = appRouter.createCaller({ prisma, session });
  const user = session.user;
  return (
    <Layout
      header={<Header item={<Navbar />} user={user} />}
      content={
        // center the avatar horizontally and vertically
        <div className="flex h-full flex-col items-center justify-center p-5">
          <div className="w-70% flex flex-row gap-4 rounded-xl bg-white p-5 shadow-lg">
            <UserAvatar user={user} size={128} />
            <div className="flex flex-col justify-start text-2xl">
              <span>{user.name}</span>
              <span>{user.email}</span>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default Projects;
