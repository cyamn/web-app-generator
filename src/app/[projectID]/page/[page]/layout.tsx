import { getServerSession } from "next-auth";

import { PageList, ViewList } from "@/components/editor/navigation";
import { authOptions } from "@/server/auth";
import { getServerSidePage } from "@/utils/get-serverside";

type PageProperties = {
  params: {
    projectID: string;
    page: string;
  };
  children: React.ReactNode;
};

const Page = async ({ params, children }: PageProperties) => {
  const session = await getServerSession(authOptions);
  const pageWithMeta = await getServerSidePage(
    params.projectID,
    params.page,
    session !== null,
  );

  if (session === null) return <div className="w-full">{children}</div>;

  return (
    <div className="flex h-full w-full flex-row overflow-auto">
      <ViewList activeView={"page"} project={params.projectID} />
      <PageList project={params.projectID} pagePath={pageWithMeta.page.path} />
      <div className="w-full">{children}</div>
    </div>
  );
};

export default Page;
