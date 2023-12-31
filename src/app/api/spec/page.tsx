import { getServerSession } from "next-auth/next";
import React from "react";

import OpenApiPanel from "@/components/editor/shared/openapi";
import GithubRibbon from "@/components/github-ribbon";
import { Header } from "@/components/header";
import { Navbar } from "@/components/navbar";
import { authOptions } from "@/server/auth";

const Page = async () => {
  const session = await getServerSession(authOptions);
  return (
    <>
      <GithubRibbon />
      <div className="flex flex-col">
        <div className="fixed w-full">
          <Header item={<Navbar />} user={session?.user} />
        </div>
        <div className="mt-8">
          <OpenApiPanel />
        </div>
      </div>
    </>
  );
};

export default Page;
