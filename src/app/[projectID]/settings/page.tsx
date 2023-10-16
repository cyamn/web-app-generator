import { ViewList } from "@/components/editor/navigation";
import { getServerSideProject } from "@/utils/get-serverside";

import { AppSettings } from "./app-settings";
import { ImExportSettings } from "./im-export-settings";
import { RoleSettings } from "./role-settings";

type PageProperties = {
  params: {
    projectID: string;
  };
};

const Page = async ({ params }: PageProperties) => {
  const project = await getServerSideProject(params.projectID);

  return (
    <div className="flex h-full flex-row overflow-auto">
      <ViewList activeView={"settings"} project={project.id} />
      <div className="h-full w-full overflow-auto">
        <div className="m-4">
          <AppSettings projectID={params.projectID} />
          <br />
          <ImExportSettings projectID={params.projectID} />
          <br />
          <RoleSettings projectID={params.projectID} />
        </div>
      </div>
    </div>
  );
};

export default Page;
