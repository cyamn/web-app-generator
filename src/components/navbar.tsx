import Link from "next/link";

export const Navbar: React.FC = () => {
  return (
    <>
      <div className="flex flex-row gap-4 text-xl">
        <Link className="font-bold" href="/">
          Home
        </Link>
        <Link className="font-bold" href="/api/spec">
          API
        </Link>
        <Link className="font-bold" href="https://karotte-docs.vercel.app/">
          Docs
        </Link>
        <div className="h-8 border-l border-slate-300"></div>

        <Link href="/projects">Projects</Link>
      </div>
    </>
  );
};
