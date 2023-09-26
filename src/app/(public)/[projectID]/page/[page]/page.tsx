import { getServerSession } from "next-auth/next";

import { Previewer } from "@/components/editor/previewer";
import { Header } from "@/components/header";
import { Navbar } from "@/components/navigation/navbar";
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
      <div className="h-full overflow-y-auto">
        <Previewer page={pageWithMeta.page} project={params.projectID} />
      </div>
    </div>
  );
};

export default Page;
