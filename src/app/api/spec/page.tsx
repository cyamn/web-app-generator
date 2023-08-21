import { getServerSession } from "next-auth/next";
import React from "react";

import OpenApiPanel from "@/components/api/openapi";
import { Header } from "@/components/header";
import { Navbar } from "@/components/navbar";
import { Layout } from "@/layout";
import { authOptions } from "@/server/auth";

const Page = async () => {
  const session = await getServerSession(authOptions);
  return (
    <Layout
      header={<Header item={<Navbar />} user={session?.user} />}
      content={<OpenApiPanel />}
    />
  );
};

export default Page;
