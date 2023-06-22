import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { Header } from "@/components/header";
import { Layout } from "@/layout";
import { api } from "@/utils/api";

dayjs.extend(relativeTime);

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>Web App Gen</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {sessionData ? <ProjectList /> : <Landing />}
    </>
  );
};

export default Home;

const Landing: React.FC = () => {
  return (
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
  );
};

const Auth: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        Sign in
      </button>
    </div>
  );
};

const ProjectList: React.FC = () => {
  const { data: sessionData } = useSession();
  const {
    data: projects,
    isError,
    isLoading,
  } = api.projects.listAll.useQuery();
  const context = api.useContext();
  const { mutate, isLoading: isCreating } = api.projects.create.useMutation({
    onSuccess: async () => context.projects.listAll.invalidate(),
  });

  const user = sessionData?.user;

  if (!user) return null;

  if (isError) return <div>error</div>;
  if (isLoading) return <div>loading</div>;

  function addProject(): void {
    const name = prompt("Project name");
    if (name === null) return;
    mutate({ name });
  }

  return (
    <>
      <Head>
        <title>My projects</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout
        header={<Header item="Apps" user={user} />}
        content={
          <div className="h-full bg-gradient-to-b from-slate-600 to-slate-800 px-64">
            <h1 className="py-8 text-center text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              Your{" "}
              <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text  text-transparent">
                Apps
              </span>
            </h1>
            <div className="grid grid-cols-3">
              {projects.map((project) => (
                <Link key={project.name} href={`/${project.name}/page`}>
                  <div className="m-3 grid h-48 min-h-min select-none place-items-center rounded-md bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-500 text-center text-3xl font-bold text-slate-100 hover:bg-gradient-to-tl">
                    <div>{dayjs(project.updatedAt).fromNow()}</div>
                    <div className="text-5xl">{project.name}</div>
                    <div>{project.description}</div>
                  </div>
                </Link>
              ))}
              <button
                disabled={isCreating}
                onClick={() => {
                  addProject();
                }}
                className="hover:bg-gradient-to m-3 grid h-48 min-h-min select-none place-items-center rounded-md bg-slate-300 text-center text-5xl text-slate-600 hover:bg-gradient-to-br hover:from-slate-400 hover:via-slate-200 hover:to-slate-400 "
              >
                {isCreating ? "...creating" : "+ new app"}
              </button>
            </div>
          </div>
        }
      />
    </>
  );
};
