"use client";
import { FC } from "react";

import { api } from "@/utils/api";

type AppSettingsProperties = {
  projectID: string;
};

export const AppSettings: FC<AppSettingsProperties> = ({ projectID }) => {
  const {
    data: project,
    isLoading,
    isError,
    error,
  } = api.projects.get.useQuery({ id: projectID });

  const context = api.useContext();

  const { mutate } = api.projects.update.useMutation({
    onSuccess: () => {
      void context.projects.get.invalidate({ id: projectID });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <>
      <h3>General Info & Settings</h3>
      <div className="text-slate-500">
        General information and Settings of your app
      </div>
      <table className="w-full text-left">
        <tr className="border-b">
          <td className="py-3">Project ID</td>
          <td className="py-3">{project.id}</td>
          <td></td>
        </tr>
        <tr className="border-b">
          <td className="py-3">Project Created</td>
          <td className="py-3">
            {project.createdAt.toLocaleDateString("en-US")}
          </td>
          <td></td>
        </tr>
        <tr className="border-b">
          <td className="py-3">Project Name</td>
          <td className="py-3">{project.name}</td>
          <td className="flex flex-row-reverse py-3">
            <button
              className="text-right text-blue-500"
              onClick={() => {
                const name = prompt("New name", project.name);
                if (name === null) return;
                mutate({
                  id: project.id,
                  data: { name },
                });
                location.reload();
              }}
            >
              Update
            </button>
          </td>
        </tr>
        <tr>
          <td className="py-3">Project Description</td>
          <td className="py-3">{project.description}</td>
          <td className="flex flex-row-reverse py-3">
            <button
              className="text-right text-blue-500"
              onClick={() => {
                const description = prompt(
                  "New description",
                  project.description
                );
                if (description === null) return;
                mutate({
                  id: project.id,
                  data: { description: description },
                });
              }}
            >
              Update
            </button>
          </td>
        </tr>
      </table>
    </>
  );
};
