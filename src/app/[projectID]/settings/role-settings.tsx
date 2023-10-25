"use client";
import { FC } from "react";

import { UserAvatar } from "@/components/editor/avatars/user";
import { api } from "@/utils/api";
import { combine } from "@/utils/combine";

type RoleSettingsProperties = {
  projectID: string;
};

export const RoleSettings: FC<RoleSettingsProperties> = ({ projectID }) => {
  const {
    data: roles,
    isLoading,
    isError,
    error,
  } = api.roles.list.useQuery({ project: projectID });

  const context = api.useContext();

  const { mutate: addRole, isLoading: isAdding } = api.roles.add.useMutation({
    onSuccess: () => {
      void context.roles.list.invalidate({ project: projectID });
    },
  });

  const { mutate: addUser } = api.roles.assignUserToRoleByMail.useMutation({
    onSuccess: () => {
      void context.roles.list.invalidate({ project: projectID });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  function createRole(): void {
    const roleName = prompt("Please enter your role name:", "my new role");
    if (roleName === null) return;
    addRole({ project: projectID, role: roleName });
  }

  function promptAddUser(roleID: string): void {
    const email = prompt(
      "Please enter an email for the person you want to add:",
      "some@mail"
    );
    if (email === null) return;
    addUser({ email, role: roleID });
  }

  return (
    <>
      <h3>Access</h3>
      <div className="text-slate-500">Edit roles and access to your app</div>
      <table className="w-full text-left">
        {roles.map((role, id) => (
          <>
            <tr key={id}>
              <td className="py-3">{role.name}</td>
              <td className="py-3">User</td>
              <td className="py-3">Rules</td>
              {/* <td className="py-3">{session.user.email}</td> */}

              <td className="flex flex-row-reverse py-3">
                <button className="pl-2 text-right text-red-500">Remove</button>
              </td>
            </tr>
            {combine(role.users, role.rules).map((tuple, id) => (
              <tr key={id}>
                <td />
                <td className="flex flex-row items-center py-3">
                  {tuple[0] !== null && (
                    <div className="mr-4 rounded-full">
                      <UserAvatar user={tuple[0]} />
                    </div>
                  )}
                  {tuple[0]?.email ?? ""}
                </td>
                <td className="py-3">{tuple[1]?.regex ?? ""}</td>
                <td />
              </tr>
            ))}
            <tr className="border-b" key={id}>
              <td />
              <td className="py-3">
                <button
                  className="text-blue-500"
                  onClick={() => {
                    promptAddUser(role.id);
                  }}
                >
                  Add
                </button>
              </td>
              <td className="py-3">
                <button className="text-blue-500">Add</button>
              </td>
              <td />
            </tr>
          </>
        ))}
        <tr className="">
          <td className="py-3">
            <button
              className="text-right text-blue-500"
              onClick={createRole}
              disabled={isAdding}
            >
              {isAdding ? "creating ..." : "Create new role"}
            </button>
          </td>
        </tr>
      </table>
    </>
  );
};
