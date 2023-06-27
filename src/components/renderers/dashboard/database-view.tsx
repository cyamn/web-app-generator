"use client";

import React from "react";

import { SkeletonTableView } from "@/components/skeletons/table-view";
import { TableView } from "@/components/table-view";
import { DatabaseView } from "@/data/dashboard/library/database-view";
import { api } from "@/utils/api";

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
  if (isLoading) return <SkeletonTableView />;

  return (
    <div>
      <TableView table={table} />
    </div>
  );
};