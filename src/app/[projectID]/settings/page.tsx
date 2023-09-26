import { ViewList } from "@/components/navigation";
import { AppSettings } from "@/components/settings/app-settings";
import { ImExportSettings } from "@/components/settings/im-export-settings";
import { RoleSettings } from "@/components/settings/role-settings";
import { getServerSideProject } from "@/utils/get-serverside";

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
