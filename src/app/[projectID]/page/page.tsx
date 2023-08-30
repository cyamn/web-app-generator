import { PageList, PagesOverview, ViewList } from "@/components/navigation";
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
      sidebarLeft={
        <div className="flex h-full flex-row">
          <ViewList activeView={"page"} project={project.id} />
          <div className="flex h-full w-full flex-col justify-between bg-slate-700">
            <PageList project={project.id} />
          </div>
        </div>
      }
      content={<PagesOverview project={project} />}
    />
  );
};

export default Page;
