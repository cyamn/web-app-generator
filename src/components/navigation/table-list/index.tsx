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
  const tablesWithMeta = await caller.tables.list({
    project,
  });

  return (
    <div className="flex h-full w-full flex-col justify-between border-r border-slate-300 bg-white">
      <nav className="flex h-full flex-col overflow-auto">
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
    </div>
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
    ? " bg-blue-100 text-blue-500"
    : " bg-white text-slate-600";

  const border = active ? "border-r-4 border-blue-500" : "";

  return (
    <div className={border}>
      <div
        className={
          "grid grid-cols-6 border-b border-l border-r border-slate-100" +
          shadow
        }
      >
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
    </div>
  );
};
