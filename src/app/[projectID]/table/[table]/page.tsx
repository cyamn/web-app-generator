import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { TableList, ViewList } from "@/components/navigation";
import { DeleteTableButton } from "@/components/table/options/delete";
import { ExportButton } from "@/components/table/options/export";
import { ImportButton } from "@/components/table/options/import";
import { TableEdit } from "@/components/table/table-edit";
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
    <div className="flex h-full flex-row">
      <ViewList activeView={"table"} project={project.id} />
      <TableList project={project.id} tableName={params.table} />
      <div className="w-full">
        <TableEdit table={params.table} project={params.projectID} />
      </div>
      <Menu project={project.id} table={params.table} />
    </div>
  );
};

const Menu: React.FC<{ project: string; table: string }> = ({
  project,
  table,
}) => {
  return (
    <div className="flex h-full w-48 flex-col overflow-auto rounded-lg p-2 text-center">
      <h2 className="m-1 text-slate-700">Options</h2>
      <div className="h-full">
        <ExportButton project={project} table={table} />
        <ImportButton project={project} table={table} />
      </div>
      <DeleteTableButton project={project} table={table} />
    </div>
  );
};

export default Page;
