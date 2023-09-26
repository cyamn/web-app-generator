import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { PageMode, Tabs } from "@/components/navigation/page-tabs";
import { Previewer } from "@/components/renderers/page-renderer";
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
      <Previewer page={pageWithMeta.page} project={project.id} />
    </>
  );
};

export default Page;
