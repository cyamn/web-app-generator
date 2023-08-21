import Link from "next/link";
import { getServerSession } from "next-auth/next";

import { PageMode } from "@/components/tabs";
import { type Page } from "@/data/page";
import { AuthRequiredError } from "@/lib/exceptions";
import { appRouter } from "@/server/api/root";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/database";

import { AddPageButton } from "./add-page-button";

type PageListProperties = {
  project: string;
  pagePath?: string;
};

export const PageList: React.FC<PageListProperties> = async ({
  project,
  pagePath = "",
}) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthRequiredError();

  const caller = appRouter.createCaller({ prisma, session });
  const pagesWithMeta = await caller.pages.list({ project: project });

  return (
    <div className="flex h-full w-full flex-col justify-between border-r border-slate-300 bg-white">
      <nav className="flex h-full flex-col overflow-auto">
        {pagesWithMeta.map((page, id) => (
          <PageItem
            key={id}
            page={page}
            project={project}
            active={pagePath === page.path}
          />
        ))}
      </nav>
      <AddPageButton project={project} />
    </div>
  );
};

interface PageItemProperties {
  project: string;
  active: boolean;
  page: Pick<Page, "name" | "path">;
}

export const PageItem: React.FC<PageItemProperties> = ({
  page,
  active,
  project,
}) => {
  const shadow = active
    ? " bg-blue-100 text-blue-500"
    : " bg-white text-slate-600";

  const border = active ? "border-l-4 border-blue-500" : "";

  return (
    <div className={border}>
      <div
        className={
          "grid grid-cols-6 border-b border-l border-r border-slate-100" +
          shadow
        }
      >
        <Link
          href={`/${project}/page/${page.path}/${PageMode.Preview}`}
          className="col-span-6 items-center  p-2"
        >
          <span className="mx-1 text-base font-medium">
            {" "}
            {page.name} {}
          </span>
        </Link>
      </div>
    </div>
  );
};
