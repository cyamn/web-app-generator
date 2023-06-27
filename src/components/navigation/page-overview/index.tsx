import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { getServerSession } from "next-auth";

import { Page } from "@/data/page";
import { AuthRequiredError } from "@/lib/exceptions";
import { appRouter } from "@/server/api/root";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/database";

import { Previewer } from "../../editor/previewer";
import { AddPageCard } from "./add-page-card";

dayjs.extend(relativeTime);

type PagesOverviewProperties = {
  project: string;
};

export const PagesOverview: React.FC<PagesOverviewProperties> = async ({
  project,
}) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthRequiredError();

  const caller = appRouter.createCaller({ prisma, session });
  const pagesWithMeta = await caller.pages.getAll(project);

  return (
    <>
      <h1 className="p-3 text-center">All Pages in {project}</h1>
      <div className="grid grid-cols-3 px-20">
        {pagesWithMeta.map((pageWithMeta) => (
          <PageDetailedItem
            updatedAt={pageWithMeta.updatedAt}
            key={pageWithMeta.page.name}
            page={pageWithMeta.page}
            project={project}
          />
        ))}
        <AddPageCard project={project} />
      </div>
    </>
  );
};

interface PageDetailedItemProperties {
  page: Page;
  project: string;
  updatedAt: Date;
}

export const PageDetailedItem: React.FC<PageDetailedItemProperties> = ({
  page,
  project,
  updatedAt,
}) => {
  return (
    <Link href={`/${project}/page/${page.path}`}>
      <div className="m-2">
        <div className="grid w-full grid-cols-2">
          <div>
            <FontAwesomeIcon icon={faFile} className="mx-2" />
            {page.name}: ({page.path}){" "}
          </div>
          <div className="pr-2 text-right text-slate-400">
            {dayjs(updatedAt).fromNow()}
          </div>
        </div>
        <div className="h-64 overflow-scroll overflow-x-hidden rounded-lg  border border-slate-300 bg-white hover:shadow-2xl">
          <div className="col-span-6">
            <div className="-translate-x-1/4 -translate-y-1/4  scale-50">
              <div className="h-[200%] w-[200%]">
                <Previewer page={page} project={project} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
