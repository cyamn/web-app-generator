import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { PageMode, Tabs } from "@/components/editor/navigation/page-tabs";
import {
  getServerSidePage,
  getServerSideProject,
} from "@/utils/get-serverside";

import { GUIEditor } from "./gui";

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
      <Tabs mode={PageMode.Edit} base={`/${project.id}/page/${params.page}`} />
      <GUIEditor project={project.id} page={pageWithMeta.page} />
    </>
  );
};

export default Page;
