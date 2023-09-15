"use client";

import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";

import { api } from "@/utils/api";
import { handleDownload } from "@/utils/download";

type ExportButtonProperties = {
  project: string;
  table: string;
};

export const ExportButton: FC<ExportButtonProperties> = ({
  project,
  table,
}) => {
  const { mutate: toCSV } = api.tables.data.exportCSV.useMutation({
    onSuccess: (data) => {
      handleDownload(data.name, data.csv, "text/csv");
    },
  });

  return (
    <div className="mt-2 w-full">
      <button
        className="w-full rounded-md bg-slate-700 p-2 text-slate-200 hover:bg-slate-600"
        type="button"
        onClick={() => {
          toCSV({ project, tableName: table });
        }}
      >
        <FontAwesomeIcon icon={faDownload} />
        <span className="ml-2">Export</span>
      </button>
    </div>
  );
};
