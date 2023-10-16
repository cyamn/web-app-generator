"use client";

import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

export const SignInOut = ({ session }: { session: Session | null }) => {
  return (
    <button
      className="rounded-full bg-slate-900/10 px-10 py-3 font-semibold text-slate-700 no-underline transition hover:bg-slate-900/20"
      onClick={session ? () => void signOut() : () => void signIn()}
    >
      {session ? "Sign out" : "Sign in"}
    </button>
  );
};
