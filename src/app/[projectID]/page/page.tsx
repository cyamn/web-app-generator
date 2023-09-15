import { PageList, PagesOverview, ViewList } from "@/components/navigation";
import { getServerSideProject } from "@/utils/get-serverside";

type PageProperties = {
  params: {
    projectID: string;
  };
};

const Page = async ({ params }: PageProperties) => {
  const project = await getServerSideProject(params.projectID, false);

  return (
    <div className="flex h-full flex-row">
      <ViewList activeView={"page"} project={project.id} />
      <PageList project={project.id} />
      <PagesOverview project={project} />
    </div>
  );
};

export default Page;
