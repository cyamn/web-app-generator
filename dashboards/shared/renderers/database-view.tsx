"use client";

import { DatabaseViewParameters } from "dashboards/library/database-view";
import React from "react";

import { SkeletonTableView } from "@/components/skeletons/table-view";
import { TableView } from "@/components/table/table-view";
import { api } from "@/utils/api";

export const DatabaseViewRender: React.FC<{
  parameters: DatabaseViewParameters;
  project: string;
}> = ({ parameters, project }) => {
  const tableName = parameters.data.table;
  const {
    data: table,
    error,
    isError,
    isLoading,
  } = api.tables.get.useQuery({
    project,
    tableName,
    columns: Object.keys(parameters.data.columns ?? {}),
    filter: parameters.data.filter ?? undefined,
  });

  if (isError) return <div>{error.message}</div>;
  if (isLoading || table === undefined) return <SkeletonTableView />;

  return (
    <div>
      <TableView
        table={table}
        project={project}
        columns={parameters.data.columns}
        controls={parameters.format.controls}
      />
    </div>
  );
};
