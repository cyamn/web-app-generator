import { getServerSession } from "next-auth/next";

import { Navbar } from "@/components/editor/navigation/navbar";
import { Header } from "@/components/header";
import { PageRenderer } from "@/components/page/page-renderer";
import { authOptions } from "@/server/auth";
import {
  getServerSidePage,
  getServerSideProject,
} from "@/utils/get-serverside";

type PageProperties = {
  params: {
    projectID: string;
    page: string;
  };
};

const Page = async ({ params }: PageProperties) => {
  const session = await getServerSession(authOptions);

  const project = await getServerSideProject(params.projectID, false);
  const pageWithMeta = await getServerSidePage(
    params.projectID,
    params.page,
    false
  );
  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10">
        <Header
          project={project.id}
          projectName={project.name}
          item={<Navbar project={project.id} />}
          user={session?.user}
        />
      </div>
      <div className="h-full overflow-y-auto p-8">
        <PageRenderer page={pageWithMeta.page} project={params.projectID} />
      </div>
    </div>
  );
};

export default Page;
