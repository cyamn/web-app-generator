import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/server/auth";

import { SignInOut } from "./sign-in-out";

export const Auth: React.FC = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-row items-center justify-center gap-4">
      {!session && <SignInOut session={session} />}
      {session && (
        <Link
          className="z-0 w-64 cursor-pointer rounded-md bg-blue-500 p-2 text-center text-lg font-semibold text-white no-underline shadow-[0_25px_40px_-10px_rgba(59,130,246,0.7)]  transition hover:bg-blue-400"
          href="/projects"
        >
          Digitalize
          <FontAwesomeIcon icon={faArrowRight} />
        </Link>
      )}
    </div>
  );
};
