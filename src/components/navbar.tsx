import Link from "next/link";

import GithubRibbon from "./github-ribbon";

export const Navbar: React.FC = () => {
  return (
    <>
      <GithubRibbon />
      <div className="flex flex-row gap-4 text-xl">
        <Link className="font-bold" href="/">
          Home
        </Link>
        <Link className="font-bold" href="/api/spec">
          API
        </Link>
        <Link className="font-bold" href="/docs">
          Docs
        </Link>
        <div className="h-8 border-l border-slate-300"></div>

        <Link href="/projects">Projects</Link>
      </div>
    </>
  );
};
