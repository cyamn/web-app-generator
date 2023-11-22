import { getServerSideTableList } from "@/utils/get-serverside";

import { ListItem } from "../shared/list-item";
import { AddTableButton } from "./add-table-button";

export type TableListProperties = {
  project: string;
  tableName?: string;
};

export const TableList: React.FC<TableListProperties> = async ({
  project,
  tableName = "",
}) => {
  const tablesWithMeta = await getServerSideTableList(project);

  return (
    <div className="flex h-full w-36 flex-col justify-between border-r border-slate-300 bg-white">
      <nav className="flex h-full flex-col overflow-auto">
        {tablesWithMeta.map((table, id) => (
          <ListItem
            key={id}
            name={table.name}
            path={`table/${table.name}`}
            active={tableName === table.name}
            project={project}
          />
        ))}
      </nav>
      <AddTableButton project={project} />
    </div>
  );
};
