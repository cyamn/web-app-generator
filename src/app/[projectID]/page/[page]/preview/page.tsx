import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Previewer } from "@/components/editor/previewer";
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
        mode={PageMode.Preview}
        base={`/${project.id}/page/${params.page}`}
      />
      <Previewer
        page={pageWithMeta.page}
        variables={pageWithMeta.variables}
        project={project.id}
      />
    </>
  );
};

export default Page;
