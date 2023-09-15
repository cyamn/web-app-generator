"use client";

import React, { useEffect } from "react";

import { DatabaseInputForm } from "@/data/dashboard/library/database-input-form";
import { DatabaseParameters } from "@/data/dashboard/parameters/database-parameters";

import { ParameterDataForm } from "./params/parameter-data";

export const DatabaseInputFormForm: React.FC<{
  dashboard: DatabaseInputForm;
  setLocalDashboard: (dashboard: DatabaseInputForm) => void;
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
