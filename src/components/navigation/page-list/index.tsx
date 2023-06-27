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
  const pagesWithMeta = await caller.pages.listAll(project);

  return (
    <div className="flex h-full w-full flex-col justify-between bg-slate-700">
      <nav className="flex h-full flex-col overflow-scroll p-1">
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
    ? " text-green-900 bg-gradient-to-r from-teal-400 to-emerald-400"
    : " bg-slate-600 text-slate-200";

  return (
    <div className={"m-[1px] grid grid-cols-6 rounded-lg" + shadow}>
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
  );
};
