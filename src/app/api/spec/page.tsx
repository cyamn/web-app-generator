import { getServerSession } from "next-auth/next";
import React from "react";

import GithubRibbon from "@/components/github-ribbon";
import { Header } from "@/components/header";
import { Navbar } from "@/components/navbar";
import OpenApiPanel from "@/components/shared/openapi";
import { authOptions } from "@/server/auth";

const Page = async () => {
  const session = await getServerSession(authOptions);
  return (
    <>
      <GithubRibbon />
      <div className="flex flex-col">
        <Header item={<Navbar />} user={session?.user} />
        <OpenApiPanel />
      </div>
    </>
  );
};

export default Page;
