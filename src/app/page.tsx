/* eslint-disable tailwindcss/no-custom-classname */
import Head from "next/head";
import Image from "next/image";
import { getServerSession } from "next-auth";

import { DottedBackground } from "@/components/dotted-background";
import GithubRibbon from "@/components/github-ribbon";
import { Header } from "@/components/header";
import HeroSection from "@/components/herosection";
import { Navbar } from "@/components/navbar";
import { authOptions } from "@/server/auth";

import { Auth } from "../components/editor/shared/auth";

const Home = async () => {
  const session = await getServerSession(authOptions);
  return (
    <>
      <Head>
        <title>Web App Gen</title>
        <meta name="description" content="Generate  by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GithubRibbon />
      <DottedBackground />
      <div className="flex h-screen flex-col">
        <Header item={<Navbar />} user={session?.user} />
        <main className="flex h-full flex-col items-center gap-4 overflow-y-auto py-24">
          <div className="flex w-full flex-col gap-2">
            <div className="w-full text-center text-4xl font-extrabold">
              Digitalize your business in no time.
              <br />
              No-Code Apps made easy.
            </div>
            <div className="w-full text-center text-lg">
              Create apps for your{" "}
              <span className="err font-semibold">business</span> or{" "}
              <span className="err font-semibold">organization</span>
              <br />
              without writing a single line of code.
            </div>
          </div>
          <Auth />
          <div className="my-32 w-2/3">
            <Image
              className="bg-white shadow-2xl"
              src="/screenshots/ScreenshotEditor.png"
              alt=""
              width={2000}
              height={2000}
            />
          </div>
          <HeroSection />
        </main>
      </div>
    </>
  );
};

export default Home;
/* eslint-enable tailwindcss/no-custom-classname */
