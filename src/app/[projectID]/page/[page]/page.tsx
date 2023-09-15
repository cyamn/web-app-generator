import { Previewer } from "@/components/editor/previewer";
import { getServerSidePage } from "@/utils/get-serverside";

type PageProperties = {
  params: {
    projectID: string;
    page: string;
  };
};

const Page = async ({ params }: PageProperties) => {
  const pageWithMeta = await getServerSidePage(
    params.projectID,
    params.page,
    false
  );
  return <Previewer page={pageWithMeta.page} project={params.projectID} />;
};

export default Page;
