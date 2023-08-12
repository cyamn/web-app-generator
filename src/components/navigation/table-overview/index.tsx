import { faTable } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import Link from "next/link";
import { getServerSession } from "next-auth";

import { TableView } from "@/components/table-view";
import { AuthRequiredError } from "@/lib/exceptions";
import { appRouter } from "@/server/api/root";
import { Table } from "@/server/api/routers/table/shared/schema";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/database";

import { AddTableCard } from "./add-table-card";

type TablesOverviewProperties = {
  project: {
    id: string;
    name: string;
  };
};

export const TablesOverview: React.FC<TablesOverviewProperties> = async ({
  project,
}) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthRequiredError();

  const caller = appRouter.createCaller({ prisma, session });
  const tablesWithMeta = await caller.tables.getAll(project.id);

  return (
    <>
      <h1 className="p-3 text-center">All Tables in {project.name}</h1>
      <div className="grid grid-cols-3 px-20">
        {tablesWithMeta.map((tableWithMeta) => (
          <TableDetailedItem
            updatedAt={tableWithMeta.updatedAt}
            key={tableWithMeta.table.name}
            table={tableWithMeta.table}
            projectName={project.id}
          />
        ))}
        <AddTableCard project={project.id} />
      </div>
    </>
  );
};

interface TableDetailedItemProperties {
  table: Table;
  projectName: string;
  updatedAt: Date;
}

export const TableDetailedItem: React.FC<TableDetailedItemProperties> = ({
  table,
  projectName,
  updatedAt,
}) => {
  return (
    <Link href={`/${projectName}/table/${table.name}`}>
      <div className="m-2">
        <div className="grid w-full grid-cols-2">
          <div>
            <FontAwesomeIcon icon={faTable} className="ml-1 mr-2" />
            {table.name}
          </div>
          <div className="pr-2 text-right text-slate-400">
            {dayjs(updatedAt).fromNow()}
          </div>
        </div>
        <div className="max-h-64 overflow-hidden  rounded-lg border border-slate-300 hover:shadow-md">
          <TableView table={table} />
        </div>
      </div>
    </Link>
  );
};
