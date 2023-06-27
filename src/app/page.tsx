import { NextPage } from "next";
import Head from "next/head";

import { Auth } from "@/components/auth";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Web App Gen</title>
        <meta name="description" content="Generate  by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-600 to-slate-800">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-center text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Create{" "}
            <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text  text-transparent">
              any <br />
              App
            </span>{" "}
            in seconds
          </h1>
          <div className="flex flex-col items-center gap-2">
            <Auth />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
