import { Table } from "@prisma/client";
import Link from "next/link";
import { getServerSession } from "next-auth/next";

import { AuthRequiredError } from "@/lib/exceptions";
import { appRouter } from "@/server/api/root";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/database";

import { AddTableButton } from "./add-table-button";

type TableListProperties = {
  project: string;
  tableName?: string;
};

export const TableList: React.FC<TableListProperties> = async ({
  project,
  tableName = "",
}) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthRequiredError();

  const caller = appRouter.createCaller({ prisma, session });
  const tablesWithMeta = await caller.tables.listAll(project);

  return (
    <>
      <nav className="flex h-full flex-col overflow-auto p-1">
        {tablesWithMeta.map((table, id) => (
          <TableItem
            key={id}
            table={table}
            active={tableName === table.name}
            project={project}
          />
        ))}
      </nav>
      <AddTableButton project={project} />
    </>
  );
};

type TableItemProperties = {
  project: string;
  active: boolean;
  table: Pick<Table, "name" | "id">;
};

export const TableItem: React.FC<TableItemProperties> = ({
  project,
  table,
  active,
}) => {
  const shadow = active
    ? " bg-blue-500 text-white"
    : " bg-slate-600 text-slate-200";

  return (
    <div className={"m-[1px] grid grid-cols-6 rounded-lg" + shadow}>
      <Link
        href={`/${project}/table/${table.name}`}
        className="col-span-6 items-center  p-2"
      >
        <span className="mx-1 text-base font-medium">
          {" "}
          {table.name} {}
        </span>
      </Link>
    </div>
  );
};
