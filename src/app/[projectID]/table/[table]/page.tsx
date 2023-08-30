import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { TableList, ViewList } from "@/components/navigation";
import { DeleteTableButton } from "@/components/table/options/delete";
import { ExportButton } from "@/components/table/options/export";
import { ImportButton } from "@/components/table/options/import";
import { TableEdit } from "@/components/table/table-edit";
import { Layout } from "@/layout";
import { getServerSideProject } from "@/utils/get-serverside";

dayjs.extend(relativeTime);

type PageProperties = {
  params: {
    projectID: string;
    table: string;
  };
};

const Page = async ({ params }: PageProperties) => {
  const project = await getServerSideProject(params.projectID);

  return (
    <Layout
      sidebarLeft={
        <div className="flex h-full flex-row border">
          <ViewList activeView={"table"} project={project.id} />
          <TableList project={project.id} tableName={params.table} />
        </div>
      }
      sidebarRight={
        // <div className="m-1 h-full overflow-auto">
        //   <h2>Options</h2>
        <Menu project={project.id} table={params.table} />
        // </div>
      }
      content={<TableEdit table={params.table} project={params.projectID} />}
    />
  );
};

const Menu: React.FC<{ project: string; table: string }> = ({
  project,
  table,
}) => {
  return (
    <div className="flex h-full w-40 flex-col overflow-auto rounded-lg p-1 text-center">
      <h2 className="m-2 text-slate-700">Options</h2>
      <div className="h-full">
        {/* export button */}
        <ExportButton project={project} table={table} />
        <ImportButton project={project} table={table} />
      </div>
      <DeleteTableButton project={project} table={table} />
    </div>
  );
};

export default Page;
