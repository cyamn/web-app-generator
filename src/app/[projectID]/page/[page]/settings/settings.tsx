"use client";

import {
  faArrowUpRightFromSquare,
  faDownload,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { UsersStack } from "@/components/editor/avatars/user";
import { Page, PageSchema } from "@/data/page";
import { api } from "@/utils/api";
import { handleDownload } from "@/utils/download";
import { handleImport } from "@/utils/import";

type SettingsProperties = {
  page: Page;
  project: string;
};

export const Settings: React.FC<SettingsProperties> = ({ page, project }) => {
  const [isPublic, setIsPublic] = useState<boolean>(
    page.access?.public ?? false
  );
  const context = api.useContext();
  const { mutate } = api.pages.togglePublicVisibility.useMutation({
    onSuccess: () => {
      toast.success(
        `Set page ${page.name} to ${isPublic ? "public" : "private"}!`
      );
      void context.pages.get.invalidate({ project, page: page.path });
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const { mutate: updatePage } = api.pages.update.useMutation({
    onSuccess: () => {
      toast.success(`Updated page ${page.name}!`);
      void context.pages.get.invalidate({ project, page: page.path });
    },
  });

  const { mutate: deletePage } = api.pages.delete.useMutation({
    onSuccess: () => {
      toast.success(`Deleted page ${page.name}!`);
      void context.pages.get.invalidate({ project, page: page.path });
      window.location.href = `/${project}/page`;
    },
  });

  function togglePublic() {
    setIsPublic(!isPublic);
    mutate({ project, pagePath: page.path, public: !isPublic });
  }

  function downloadJSON() {
    const data = JSON.stringify(page, null, 2);
    handleDownload(`${page.name}.json`, data, "text/json");
  }

  async function importJSON() {
    const json = await handleImport([".json"]);
    if (json === null) return;
    if (json[0] === undefined) return;
    const data: unknown = JSON.parse(json[0]);
    const page = PageSchema.safeParse(data);
    if (!page.success) {
      toast.error("Invalid JSON file!");
      return;
    }
    updatePage({ project, page: page.data });
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
        <tr>
          <td className="w-52 px-6 py-2">Data</td>
          <td className="flex w-full flex-row gap-2 p-2">
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
          </td>
        </tr>
        <tr>
          <td className="w-52 px-6 py-2">Delete</td>
          <td className="flex w-full flex-row gap-2 p-2">
            <button
              className="
        w-full rounded-lg border border-red-500 bg-red-100 px-4 py-2 font-bold text-red-600 hover:bg-red-600 hover:text-white
        "
              type="button"
              onClick={() => {
                if (
                  !confirm(
                    `Are you sure you want to delete page ${page.name}? This cannot be undone!`
                  )
                )
                  return;
                deletePage({
                  project,
                  page: page.path,
                });
              }}
            >
              <span className="ml-2">Delete page</span>
            </button>
          </td>
        </tr>
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
  } = api.pages.roleAccess.useQuery({ project, page });

  const { mutate } = api.pages.setRoleAccess.useMutation({
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
                disabled={role.isAdmin}
                checked={role.access}
                onChange={() => {
                  role.access = !role.access;
                  toggleRoleAccessibility(role.id, role.access);
                  toast.success(`Updated access for ${role.name}!`);
                }}
              />
              <div className="w-24 pr-2">{role.name}</div>
              <UsersStack users={role.users} />
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
