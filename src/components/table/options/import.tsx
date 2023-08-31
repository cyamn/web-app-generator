"use client";

import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";

import { api } from "@/utils/api";
import { handleImport } from "@/utils/import";

type ImportButtonProperties = {
  project: string;
  table: string;
};

export const ImportButton: FC<ImportButtonProperties> = ({
  project,
  table,
}) => {
  const context = api.useContext();

  const { mutate: importCSV } = api.tables.data.importCSV.useMutation({
    onSuccess: () => {
      void context.tables.get.invalidate({ project, tableName: table });
    },
  });

  async function importFile() {
    const csv = await handleImport([".csv"]);
    if (csv === null || csv[0] === undefined) return;
    importCSV({ project, table, csv: csv[0], name: table });
  }

  return (
    <div className="mt-2 w-full">
      <button
        className="w-full rounded-md bg-slate-700 p-2 text-slate-200 hover:bg-slate-600"
        type="button"
        onClick={() => {
          void importFile();
        }}
      >
        <FontAwesomeIcon icon={faUpload} />
        <span className="ml-2">Import</span>
      </button>
    </div>
  );
};
