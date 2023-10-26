"use client";

import { FC } from "react";
import toast from "react-hot-toast";

import { api } from "@/utils/api";

type DeleteButtonProperties = {
  projectID: string;
  projectName: string;
};

export const DeleteProjectButton: FC<DeleteButtonProperties> = ({
  projectID,
  projectName,
}) => {
  const { mutate } = api.projects.delete.useMutation({
    onSuccess: () => {
      toast.success("Deleted project");
      window.location.href = "/projects";
    },
  });

  function deleteProject() {
    // ask to type the project name to confirm
    const confirm = prompt(`Please type "${projectName}" to confirm deletion`);
    if (confirm === null) return;
    if (confirm !== projectName) {
      toast.error("Project name does not match! Aborted deletion.");
      return;
    }
    mutate({
      id: projectID,
    });
  }

  return (
    <>
      <div className="flex w-full flex-row gap-2 p-2">
        <button
          onClick={deleteProject}
          className="w-full rounded-lg border border-red-500 bg-red-100 px-4 py-2 font-bold text-red-600 hover:bg-red-600 hover:text-white"
        >
          <span className="ml-2">Delete Project</span>
        </button>
      </div>
    </>
  );
};
