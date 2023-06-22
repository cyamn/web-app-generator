import React from "react";

import { DatabaseView } from "@/data/dashboard/library/database-view";
import { api } from "@/utils/api";

import { TableView } from "../table-view";

export const DatabaseViewRender: React.FC<{
  dashboard: DatabaseView;
  projectName: string;
}> = ({ dashboard, projectName }) => {
  const tableName = dashboard.parameters.data.table;
  const {
    data: table,
    error,
    isError,
    isLoading,
  } = api.tables.get.useQuery({
    projectName,
    tableName,
  });

  if (isError) return <div>{error.message}</div>;
  if (isLoading) return <div>loading</div>;

  return (
    <div>
      <TableView table={table} />
    </div>
  );
};
