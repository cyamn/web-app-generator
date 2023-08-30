import { ViewList } from "@/components/navigation";
import { AppSettings } from "@/components/settings/app-settings";
import { RoleSettings } from "@/components/settings/role-settings";
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
      sidebarLeft={<ViewList activeView={"settings"} project={project.id} />}
      content={
        <div className="m-4">
          <AppSettings projectID={params.projectID} />
          <br />
          <RoleSettings projectID={params.projectID} />
        </div>
      }
    />
  );
};

export default Page;
