import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { Header } from "@/components/header";
import { ViewList } from "@/components/view-list";
import { type Page } from "@/data/page";
import { PageMode } from "@/data/state";
import { Layout } from "@/layout";
import { api } from "@/utils/api";

dayjs.extend(relativeTime);

type TableRoutes = {
  project: string;
  table: string;
};

export enum EditorStatus {
  INVALID_JSON = "invalid json",
  INVALID_PAGE = "invalid page",
  CHANGED = "changed",
  SAVED = "saved",
  AUTOSAVED = "auto saved",
}

function statusToCSS(status: EditorStatus): string {
  switch (status) {
    case EditorStatus.INVALID_JSON:
    case EditorStatus.INVALID_PAGE: {
      return "bg-red-500 text-red-950";
    }
    case EditorStatus.CHANGED: {
      return "bg-green-500 text-green-950";
    }
    case EditorStatus.SAVED:
    case EditorStatus.AUTOSAVED: {
      return "bg-blue-500 text-blue-950";
    }
    default: {
      return "bg-slate-500 text-slate-950";
    }
  }
}

const Page: NextPage = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { project: projectName, table: tableName } =
    router.query as TableRoutes;

  const [pageMode, setPageMode] = useState<PageMode>(PageMode.Preview);
  const {
    data: table,
    error,
    isError,
    isLoading,
  } = api.tables.get.useQuery({
    projectName,
    tableName,
  });

  const [status, setStatus] = useState<EditorStatus>(EditorStatus.SAVED);

  const context = api.useContext();

  // const { mutate, isLoading: isSaving } =
  //   api.projects.updatePageOfProject.useMutation({
  //     onSuccess: () => {
  //       void ctx.projects.getPageOfProject.invalidate({
  //         projectName,
  //         pagePath,
  //       });
  //     },
  //   });

  if (!projectName || !tableName) return <div>invalid path</div>;
  if (!sessionData) return <div>not logged in</div>;
  if (isError) return <div>{error.message}</div>;
  if (isLoading) return <div>loading</div>;

  // const { page, updatedAt } = pageWithMeta;

  return (
    <>
      <Head>
        <title>{table.name}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout
        header={
          <Header
            item={
              <div className="flex flex-row items-center">
                <div>
                  {projectName} 👉 {table.name}
                </div>
                <button
                  disabled={false}
                  // onClick={() => trySaveToDatabase()}
                  className={
                    "mx-3 rounded-md  px-1 font-mono " + statusToCSS(status)
                  }
                >
                  {status}
                </button>
                <div className="text-sm text-slate-400">
                  {/* last saved {dayjs(updatedAt).fromNow()} */}
                </div>
              </div>
            }
            user={sessionData.user}
          />
        }
        sidebarLeft={
          <div className="flex h-full flex-col bg-slate-700">
            <div className="flex h-full flex-row">
              <ViewList activeView={"table"} projectName={projectName} />
              <div className="flex h-full w-full flex-col justify-between bg-slate-700">
                <TableList projectName={projectName} tableName={tableName} />
              </div>
            </div>
            {/* <StatusBar /> */}
          </div>
        }
        content={
          <div>
            <TableView table={table} />
          </div>
        }
      />
    </>
  );
};

import { NextPage } from "next";

import { TableList } from "@/components/table-list";
import { TableView } from "@/components/table-view";
export default Page;
