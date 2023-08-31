import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Settings } from "@/components/settings";
import { PageMode, Tabs } from "@/components/tabs";
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
        mode={PageMode.Settings}
        base={`/${project.id}/page/${params.page}`}
      />
      <Settings project={project.id} page={pageWithMeta.page} />
    </>
  );
};

export default Page;
