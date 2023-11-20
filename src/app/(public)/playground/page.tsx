import { getServerSession } from "next-auth/next";
import React from "react";

import GithubRibbon from "@/components/github-ribbon";
import { Header } from "@/components/header";
import { Navbar } from "@/components/navbar";
import { Page } from "@/data/page";
import { authOptions } from "@/server/auth";

import { Playground } from "./playground";

const defaultPage: Page = {
  path: "/",
  name: "Home",
  dashboards: [
    {
      type: "markdown",
      parameters: {
        markdown: "# Hello World!",
      },
    },
  ],
};

const Projects = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex h-full flex-col">
      <GithubRibbon />
      <div className="fixed w-full">
        <Header item={<Navbar />} user={session?.user} />
      </div>
      <div className="h-full">
        <Playground />
      </div>
    </div>
  );
};

export default Projects;
