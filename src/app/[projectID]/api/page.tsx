import "swagger-ui-react/swagger-ui.css";

import { ViewList } from "@/components/navigation";
import OpenApiPanel from "@/components/shared/openapi";
import { getServerSideProject } from "@/utils/get-serverside";

type PageProperties = {
  params: {
    projectID: string;
  };
};

const Page = async ({ params }: PageProperties) => {
  const project = await getServerSideProject(params.projectID);

  return (
    <div className="flex h-full flex-row overflow-hidden">
      <ViewList activeView={"api"} project={project.id} />
      <div className="h-full w-full flex-row overflow-y-auto">
        <OpenApiPanel />
      </div>
    </div>
  );
};

export default Page;
