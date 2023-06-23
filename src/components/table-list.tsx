import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";

import { api } from "@/utils/api";

type TableListProperties = {
  projectName: string;
  tableName?: string;
};

export const TableList: React.FC<TableListProperties> = ({
  projectName,
  tableName = "",
}) => {
  const {
    data: tablesWithMeta,
    error,
    isError,
    isLoading,
  } = api.tables.listAll.useQuery(projectName);

  const context = api.useContext();
  const { mutate, isLoading: isCreating } = api.tables.add.useMutation({
    onSuccess: () => {
      void context.tables.listAll.invalidate(projectName);
    },
  });

  if (isError) return <div>{error.message}</div>;
  if (isLoading) return <div>loading</div>;

  const addTable = (): void => {
    const tableName = prompt(
      "Please enter your table name:",
      "my awesome table"
    );
    if (tableName === null) return;
    mutate({ projectName, tableName });
  };

  return (
    <>
      <nav className="flex h-full flex-col overflow-scroll p-1">
        {tablesWithMeta.map((table, id) => (
          <TableItem key={id} table={table} active={tableName === table.name} />
        ))}
      </nav>
      <a
        onClick={addTable}
        className="m-1 flex cursor-pointer items-center rounded-lg px-4 py-3 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
      >
        <FontAwesomeIcon icon={faPlus} />
        <button disabled={isCreating} className="ml-3 text-sm font-medium">
          {isCreating ? "adding ..." : "add table"}
        </button>
      </a>
    </>
  );
};

type TableRoutes = {
  project: string;
  table: string;
};

type TableItemProperties = {
  active: boolean;
  table: Pick<Table, "name" | "id">;
};

export const TableItem: React.FC<TableItemProperties> = ({ table, active }) => {
  const router = useRouter();
  const { project: projectName } = router.query as TableRoutes;
  const shadow = active
    ? " text-slate-900 bg-gradient-to-r from-fuchsia-400 to-purple-400"
    : " bg-slate-600 text-slate-200";

  return (
    <div className={"m-[1px] grid grid-cols-6 rounded-lg" + shadow}>
      <Link
        href={`/${projectName}/table/${table.name}`}
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
