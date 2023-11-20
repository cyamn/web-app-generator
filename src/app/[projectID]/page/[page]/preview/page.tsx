import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { PageMode, Tabs } from "@/components/editor/navigation/page-tabs";
import { PageRenderer } from "@/components/page/page-renderer";
import {
  getServerSidePage,
  getServerSideProject,
} from "@/utils/get-serverside";

dayjs.extend(relativeTime);

type PageProperties = {
  params: {
    projectID: string;
    page: string;
  };
};

const Page = async ({ params }: PageProperties) => {
  const project = await getServerSideProject(params.projectID);
  const pageWithMeta = await getServerSidePage(project.id, params.page);

  return (
    <>
      <Tabs
        mode={PageMode.Preview}
        base={`/${project.id}/page/${params.page}`}
      />
      <div className="h-full overflow-y-auto">
        <div className="m-8">
          <PageRenderer page={pageWithMeta.page} project={project.id} />
        </div>
      </div>
    </>
  );
};

export default Page;
