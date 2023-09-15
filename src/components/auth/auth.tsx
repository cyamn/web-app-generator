import Link from "next/link";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/server/auth";

import { SignInOut } from "./sign-in-out";

export const Auth: React.FC = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-row items-center justify-center gap-4">
      <SignInOut session={session} />
      {session && (
        <Link
          className="rounded-full bg-slate-900/10 px-10 py-3 font-semibold text-slate-700 no-underline transition hover:bg-slate-900/20"
          href="/projects"
        >
          Go to projects
        </Link>
      )}
    </div>
  );
};
