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
    <div className="flex flex-col">
      <Header
        project={project.id}
        projectName={project.name}
        item={<Navbar project={project.id} />}
        user={session?.user}
      />
      <Previewer page={pageWithMeta.page} project={params.projectID} />;
    </div>
  );
};

export default Page;
