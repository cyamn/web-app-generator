import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import { Auth } from "@/components/auth";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Web App Gen</title>
        <meta name="description" content="Generate  by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-center text-5xl font-extrabold tracking-tight text-slate-600 sm:text-[5rem]">
            <span className="bg-gradient-to-br from-blue-500 to-blue-300 bg-clip-text text-transparent">
              Business Apps
            </span>
            <br />
            <span className="">in minutes</span>
          </h1>
          <Image src="/cto.svg" alt="logo" width={300} height={300} />
          <Auth />
        </div>
      </main>
    </>
  );
};

export default Home;
