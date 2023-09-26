"use client";

import { faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import toast from "react-hot-toast";

import { DProjectSchema } from "@/data/project";
import { api } from "@/utils/api";
import { handleDownload } from "@/utils/download";
import { handleImport } from "@/utils/import";

type ImExportSettingsProperties = {
  projectID: string;
};

export const ImExportSettings: FC<ImExportSettingsProperties> = ({
  projectID,
}) => {
  const {
    data: project,
    isLoading,
    isError,
  } = api.projects.export.useQuery({
    id: projectID,
  });

  const context = api.useContext();

  const { mutate: importProject } = api.projects.import.useMutation({
    onSuccess: () => {
      void context.projects.get.invalidate({ id: projectID });
      void context.roles.list.invalidate({ project: projectID });
      toast.success("Updated project");
    },
  });

  function downloadJSON() {
    if (isLoading || isError) return;
    const data = JSON.stringify(project, null, 2);
    handleDownload(`${project.name}.json`, data, "text/json");
  }

  async function importJSON() {
    const json = await handleImport([".json"]);
    if (json === null) return;
    if (json[0] === undefined) return;
    const data: unknown = JSON.parse(json[0]);
    const project = DProjectSchema.safeParse(data);
    if (!project.success) {
      toast.error("Invalid JSON file!");
      return;
    }
    importProject({ projectID, project: project.data });
  }

  return (
    <>
      <div className="flex w-full flex-row gap-2 p-2">
        <button
          className="w-full rounded-md bg-slate-700 p-2 text-slate-200 hover:bg-slate-600"
          type="button"
          onClick={downloadJSON}
        >
          <FontAwesomeIcon icon={faDownload} />
          <span className="ml-2">Export</span>
        </button>
        <button
          className="w-full rounded-md bg-slate-700 p-2 text-slate-200 hover:bg-slate-600"
          type="button"
          onClick={() => void importJSON()}
        >
          <FontAwesomeIcon icon={faUpload} />
          <span className="ml-2">Import</span>
        </button>
      </div>
    </>
  );
};
