import { getServerSession } from "next-auth/next";
import React from "react";

import { UserAvatar } from "@/components/editor/avatars/user";
import { Header } from "@/components/header";
import { Navbar } from "@/components/navbar";
import { AuthRequiredError } from "@/lib/exceptions";
import { authOptions } from "@/server/auth";

const Projects = async () => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthRequiredError();

  const user = session.user;
  return (
    <div className="flex flex-col">
      <Header item={<Navbar />} user={user} />
      <div className="flex h-full flex-col items-center justify-center p-5">
        <div className="flex w-2/3 flex-row gap-4 rounded-xl bg-white p-5 shadow-lg">
          <UserAvatar user={user} size={128} />
          <div className="flex flex-col justify-start text-2xl">
            <span>{user.name}</span>
            <span>{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
