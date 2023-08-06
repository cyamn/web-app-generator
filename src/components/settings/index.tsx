"use client";

import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { Page } from "@/data/page";
import { api } from "@/utils/api";

type SettingsProperties = {
  page: Page;
  project: string;
};

export const Settings: React.FC<SettingsProperties> = ({ page, project }) => {
  const [isPublic, setIsPublic] = useState<boolean>(
    page.access?.public ?? false
  );
  const context = api.useContext();
  const { mutate, isLoading, isError } = api.settings.setPagePublic.useMutation(
    {
      onSuccess: () => {
        toast.success(
          `Set page ${page.name} to ${isPublic ? "public" : "private"}!`
        );
        void context.pages.get.invalidate({ project, page: page.path });
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }
  );

  function togglePublic() {
    setIsPublic(!isPublic);
    mutate({ project, pagePath: page.path, public: !isPublic });
  }

  return (
    <div className="p-5">
      <div className="text-6xl">Settings</div>
      <br />
      <table className="w-full overflow-hidden rounded-lg bg-slate-50 shadow-md">
        <tr className="w-full border-b bg-white p-10 hover:bg-slate-50">
          <td className="w-52 px-6 py-2">Page Name:</td>
          <td className="w-max px-4 py-2">{page.name}</td>
        </tr>
        <tr className="w-full border-b bg-white p-10 hover:bg-slate-50">
          <td className="w-52 px-6 py-2">Public</td>
          <td className="w-max px-4 py-2">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={isPublic}
                className="peer sr-only"
                onClick={togglePublic}
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute  after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4  peer-focus:ring-blue-300"></div>
            </label>
          </td>
        </tr>
        {!isPublic && <CanView project={project} page={page.path} />}
      </table>
    </div>
  );
};

type AccessSettingsProperties = {
  project: string;
  page: string;
};

const CanView: React.FC<AccessSettingsProperties> = ({ project, page }) => {
  const {
    data: roles,
    isLoading,
    isError,
    error,
  } = api.settings.getPageRoleAccess.useQuery({ project, page });

  const context = api.useContext();

  const { mutate, isLoading: isUpdating } =
    api.settings.setPageRoleAccess.useMutation({
      onSuccess: () => {
        //void context.settings.getPageRoleAccess.invalidate({ project, page });
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  function toggleRoleAccessibility(roleID: string, access: boolean) {
    mutate({ project, page, role: roleID, access });
  }

  return (
    <tr className="w-full border-b bg-white p-10 hover:bg-slate-50">
      <td className="w-52 px-6 py-2">Can view</td>
      <td className="w-max px-4 py-2">
        {roles.map((role, id) => (
          <div key={id}>
            <div className="my-1 flex flex-row items-center">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                checked={role.access}
                onChange={() => {
                  role.access = !role.access;
                  toggleRoleAccessibility(role.id, role.access);
                  toast.success(`Updated access for ${role.name}!`);
                }}
              />
              <div className="w-24 pr-2">{role.name}</div>
              <div className="flex w-24 flex-row items-center">
                {role.users.map((user, id) => (
                  <Image
                    key={id}
                    src={user.image?.toString() ?? ""}
                    width={24}
                    height={24}
                    alt=""
                    className="border-1 -mr-2 rounded-full border border-slate-800"
                  />
                ))}
              </div>
              <a href={`/${project}/settings#roles`}>
                <FontAwesomeIcon
                  className="text-slate-300"
                  icon={faArrowUpRightFromSquare}
                />
              </a>
            </div>
          </div>
        ))}
      </td>
    </tr>
  );
};
