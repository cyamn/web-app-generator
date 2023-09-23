/* eslint-disable tailwindcss/no-custom-classname */
import Head from "next/head";
import Image from "next/image";
import { getServerSession } from "next-auth";

import { Auth } from "@/components/auth";
import GithubRibbon from "@/components/github-ribbon";
import { Header } from "@/components/header";
import { Logo } from "@/components/logo";
import { Navbar } from "@/components/navbar";
import { authOptions } from "@/server/auth";

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
      <div className="flex h-screen flex-col">
        <Header item={<Navbar />} user={session?.user} />
        <main className="flex h-full flex-col items-center justify-center bg-slate-100">
          <div className="flex flex-row items-center gap-28">
            <div className="flex flex-col gap-10">
              <div className="hover:scale-125">
                <Image
                  className="animate-jump-in animate-delay-200 animate-once animate-ease-in rounded-xl border-2 border-fuchsia-500 bg-white p-4 drop-shadow-xl"
                  src="/example/jsonExample.png"
                  alt=""
                  width={300}
                  height={300}
                />
              </div>
              <div className="hover:scale-125">
                <Image
                  className="animate-jump-in animate-delay-[400ms] animate-once animate-ease-in rounded-xl border-2 border-green-500 bg-white p-4 drop-shadow-xl"
                  src="/example/csvExample.png"
                  alt=""
                  width={300}
                  height={300}
                />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-12 px-4 py-16 ">
              {/* <h1 className="text-center text-5xl font-bold tracking-tight text-slate-600 sm:text-[5rem]">
                KAROTTE
              </h1> */}
              <Logo />
              <div className="flex flex-row items-center gap-2 text-5xl">
                <Image
                  className="animate-jump-in animate-delay-200 animate-once animate-ease-in"
                  src="/JSON.svg"
                  alt="Json"
                  width={80}
                  height={80}
                />
                +
                <Image
                  className="animate-jump-in animate-delay-[400ms] animate-once animate-ease-in"
                  src="/CSV.svg"
                  alt="Json"
                  width={80}
                  height={80}
                />
                =
                <Image
                  className="animate-jump-in animate-delay-[800ms] animate-once animate-ease-in"
                  // eslint-disable-next-line spellcheck/spell-checker
                  src="/smilyface.png"
                  alt="Json"
                  width={90}
                  height={80}
                />
              </div>
              <Auth />
            </div>
            <div className="hover:scale-125">
              <Image
                className="animate-jump-in animate-delay-[800ms] animate-once animate-ease-in rounded-xl border-2 border-yellow-300 bg-white drop-shadow-xl"
                src="/example/appExample.png"
                alt=""
                width={300}
                height={300}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
/* eslint-enable tailwindcss/no-custom-classname */
