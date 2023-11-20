"use client";

import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

export const SignInOut = ({ session }: { session: Session | null }) => {
  return (
    <button
      className="z-0 w-64 cursor-pointer rounded-md bg-blue-500 p-2 text-center text-lg font-semibold text-white no-underline shadow-[0_25px_40px_-10px_rgba(59,130,246,0.7)]  transition hover:bg-blue-400"
      onClick={session ? () => void signOut() : () => void signIn()}
    >
      {session ? "Sign out" : "Sign in"}
    </button>
  );
};
