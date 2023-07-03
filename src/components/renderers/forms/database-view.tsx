"use client";

import React, { useEffect } from "react";

import { DatabaseView } from "@/data/dashboard/library/database-view";
import { DatabaseParameters } from "@/data/dashboard/parameters/database-parameters";

import { ParameterDataForm } from "./params/parameter-data";

export const DatabaseViewForm: React.FC<{
  dashboard: DatabaseView;
  setLocalDashboard: (dashboard: DatabaseView) => void;
  project: string;
}> = ({ dashboard, setLocalDashboard, project }) => {
  const [data, setData] = React.useState(dashboard.parameters.data);
  useEffect(() => {
    setData(dashboard.parameters.data);
  }, [dashboard.parameters.data]);

  function onSetData(newData: DatabaseParameters) {
    setLocalDashboard({
      ...dashboard,
      parameters: {
        ...dashboard.parameters,
        data: newData,
      },
    });
  }
  return (
    <>
      <ParameterDataForm data={data} onSetData={onSetData} project={project} />
    </>
  );
};
