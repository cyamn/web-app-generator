import "swagger-ui-react/swagger-ui.css";

import OpenApiPanel from "@/components/api/openapi";
import { ViewList } from "@/components/navigation";
import { Layout } from "@/layout";
import { getServerSideProject } from "@/utils/get-serverside";

type PageProperties = {
  params: {
    projectID: string;
  };
};

const Page = async ({ params }: PageProperties) => {
  const project = await getServerSideProject(params.projectID);

  return (
    <Layout
      sidebarLeft={<ViewList activeView={"api"} project={project.id} />}
      content={<OpenApiPanel />}
    />
  );
};

export default Page;
