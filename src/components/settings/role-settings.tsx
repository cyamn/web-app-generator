"use client";
import { FC } from "react";

import { api } from "@/utils/api";

type RoleSettingsProperties = {
  projectID: string;
};

export const RoleSettings: FC<RoleSettingsProperties> = ({ projectID }) => {
  const {
    data: project,
    isLoading,
    isError,
    error,
  } = api.projects.get.useQuery(projectID);

  const context = api.useContext();

  const { mutate } = api.projects.update.useMutation({
    onSuccess: () => {
      void context.projects.get.invalidate(projectID);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <>
      <h3>Access</h3>
      <div className="text-slate-500">Edit roles and access to your app</div>
      <table className="w-full text-left">
        <tr className="border-b">
          <td className="py-3">Developers</td>
          {/* <td className="py-3">{session.user.email}</td> */}
          <td className="py-3">test</td>
          <td className="flex flex-row-reverse py-3">
            <button className="pl-2 text-right text-red-500">Remove</button>
            <button className="text-right text-blue-500">Add</button>
          </td>
        </tr>
        <tr className="">
          <td className="py-3">
            <button className="text-right text-blue-500">
              Create new role
            </button>
          </td>
        </tr>
      </table>
    </>
  );
};
